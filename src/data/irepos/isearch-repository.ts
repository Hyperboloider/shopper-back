import { QueryDslFunctionScoreContainer, SearchHit } from "@elastic/elasticsearch/lib/api/types"
import { ElasticProductSource } from "src/search/elastic.response/elastic-product-response.dto"

export interface ISearchRepository {
    getAutocompleteProductsForQuery(query: string): Promise<SearchHit<ElasticProductSource>[]>

    getAvgPriceByCategory(category: string): Promise<number | null>
    getMaxValueByCategory(field: string): Promise<number | null>

    getProductsCheaperThan(
        price: number,
        excludingIds: string[],
        category: string
    ): Promise<SearchHit<ElasticProductSource>[]>

    getProductsMoreExpensiveThan(
        price: number,
        excludingIds: string[],
        category: string
    ): Promise<SearchHit<ElasticProductSource>[]>

    getProductsWithinRange(
        lower: number,
        upper: number,
        excludingIds: string[],
        category: string
    ): Promise<SearchHit<ElasticProductSource>[]>

    getAdjustedProducts(
        gaussOptions: QueryDslFunctionScoreContainer[],
        categories: string[]
    ): Promise<SearchHit<ElasticProductSource>[]>
}
