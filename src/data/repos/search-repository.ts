import { Client } from "@elastic/elasticsearch"
import { QueryDslFunctionScoreContainer, SearchHit } from "@elastic/elasticsearch/lib/api/types"
import { ElasticProductSource } from "src/search/elastic.response/elastic-product-response.dto"
import { ISearchRepository } from "../irepos"

export class SearchRepository implements ISearchRepository {
    private readonly esClient: Client

    constructor() {
        this.esClient = new Client({
            cloud: {
                id: String(process.env.ELASTIC_CLOUD_ID)
            },
            auth: {
                username: String(process.env.ELASTIC_CLOUD_USERNAME),
                password: String(process.env.ELASTIC_CLOUD_PASSWORD)
            }
        })
    }

    async getMaxValueByCategory(field: string): Promise<number | null> {
        const res = await this.esClient.search({
            size: 0,
            aggs: {
                max_price: {
                    max: {
                        field: field
                    }
                }
            }
        })

        const num = res.aggregations?.max_price as { value: number }
        return num.value
    }

    async getAutocompleteProductsForQuery(
        query: string
    ): Promise<SearchHit<ElasticProductSource>[]> {
        const res = await this.esClient.search<ElasticProductSource>({
            index: "products",
            query: {
                match: {
                    name: {
                        query: query,
                        operator: "OR"
                    }
                }
            }
        })

        return res.hits.hits
    }

    async getAvgPriceByCategory(category: string): Promise<number | null> {
        const res = await this.esClient.search({
            size: 0,
            aggs: {
                average_price: {
                    avg: {
                        field: "price"
                    }
                }
            },
            query: {
                term: {
                    categoryId: category
                }
            }
        })

        const num = res.aggregations?.average_price as { value: number }
        return num.value
    }

    async getProductsCheaperThan(
        price: number,
        excludingIds: string[],
        category: string
    ): Promise<SearchHit<ElasticProductSource>[]> {
        const res = await this.esClient.search<ElasticProductSource>({
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                price: {
                                    lt: price
                                }
                            }
                        },
                        {
                            match: {
                                categoryId: category
                            }
                        }
                    ],
                    must_not: {
                        terms: {
                            _id: excludingIds
                        }
                    }
                }
            }
        })

        return res.hits.hits
    }

    async getProductsMoreExpensiveThan(
        price: number,
        excludingIds: string[],
        category: string
    ): Promise<SearchHit<ElasticProductSource>[]> {
        const res = await this.esClient.search<ElasticProductSource>({
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                price: {
                                    gt: price
                                }
                            }
                        },
                        {
                            match: {
                                categoryId: category
                            }
                        }
                    ],
                    must_not: {
                        terms: {
                            _id: excludingIds
                        }
                    }
                }
            }
        })

        return res.hits.hits
    }

    async getProductsWithinRange(
        lower: number,
        upper: number,
        excludingIds: string[],
        category: string
    ): Promise<SearchHit<ElasticProductSource>[]> {
        const res = await this.esClient.search<ElasticProductSource>({
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                price: {
                                    gt: lower,
                                    lt: upper
                                }
                            }
                        },
                        {
                            match: {
                                categoryId: category
                            }
                        }
                    ],
                    must_not: {
                        terms: {
                            _id: excludingIds
                        }
                    }
                }
            }
        })

        return res.hits.hits
    }

    async getAdjustedProducts(
        gaussOptions: QueryDslFunctionScoreContainer[],
        categories: string[]
    ): Promise<SearchHit<ElasticProductSource>[]> {
        const res = await this.esClient.search<ElasticProductSource>({
            size: 5 * categories.length,
            query: {
                function_score: {
                    query: {
                        terms: {
                            categoryId: categories
                        }
                    },
                    functions: gaussOptions
                }
            }
        })

        return res.hits.hits
    }
}
