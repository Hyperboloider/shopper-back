/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { IDataService } from "src/data/data-service/idata-service"
import { ResponseProductDto } from "src/products/dto"
import { CartItem, PopulatedCartItem } from "./dto"
import { OptimisationDTO } from "./dto/optimisation.dto"
import { PriceRangeType } from "./enum"
import { ISearchService } from "./isearch.service"
import { PriceRange } from "./types"

class CategoryProducts {
    constructor(avg: number, ranges: ProductsByPriceRange) {
        this.avg = avg
        this.ranges = ranges
    }

    avg: number
    ranges: ProductsByPriceRange
}
type ProductsByPriceRange = Record<PriceRangeType, ResponseProductDto[]>
type PriceRangesByCategory = Record<string, CategoryProducts>

@Injectable()
export class SearchService implements ISearchService {
    constructor(private dataServices: IDataService) {}

    async getMaximixProducts(request: OptimisationDTO): Promise<ResponseProductDto[]> {
        const gaussOptions = await Promise.all(
            request.options.map(async (optionDto) => {
                const field = optionDto.option.valueOf()

                const maxValue =
                    (await this.dataServices.searchRepository.getMaxValueByCategory(field)) ?? 0

                const origin = optionDto.isMax ? maxValue : 0
                const scale = maxValue / 3

                const q = {
                    exp: {
                        [field]: {
                            origin: origin,
                            scale: scale
                        }
                    }
                }

                return q
            })
        )

        const minimaxResult = await this.dataServices.searchRepository.getAdjustedProducts(
            gaussOptions,
            request.categories
        )

        return minimaxResult
            .map((product) => ResponseProductDto.parseFromElastic(product)!)
            .filter((p) => !!p)
    }

    async getAutocompleteProductsForQuery(query: string): Promise<ResponseProductDto[]> {
        const res = await this.dataServices.searchRepository.getAutocompleteProductsForQuery(query)
        if (!res) {
            throw new InternalServerErrorException("Elastic is down")
        }

        return res
            .map((product) => ResponseProductDto.parseFromElastic(product)!)
            .filter((p) => !!p)
    }

    async getSimilarCarts(cart: CartItem[]): Promise<PopulatedCartItem[][]> {
        const cartIds = cart.map((item) => item.product)
        const populatedCart = (await this.dataServices.productRepository.getByIds(cartIds)).map((doc) =>
            ResponseProductDto.parseFromDocument(doc)
        )
        const initialCart = populatedCart.map((populatedProduct) => {
            const product = cart.find((p) => p.product === populatedProduct.id)
            if (product) {
                return new PopulatedCartItem(product.quantity, populatedProduct)
            }

            return null
        })
        .filter((p) => p !== null)
        .map((p) => p!)

        const productsByCategories = this.groupBy(initialCart, (i) => i.product.category)
        const priceRangesByCategories: PriceRangesByCategory = {}
        const productsPriceRangeMap: Record<string, PriceRangeType> = {}

        for (const category in productsByCategories) {
            const avgCategoryPrice = await this.dataServices.searchRepository.getAvgPriceByCategory(
                category
            )

            const productsByPriceRanges: ProductsByPriceRange = {
                [PriceRangeType.LOWER]: [],
                [PriceRangeType.MIDDLE]: [],
                [PriceRangeType.UPPER]: []
            }
            const categoryProducts = new CategoryProducts(0, productsByPriceRanges)

            if (!avgCategoryPrice) {
                priceRangesByCategories[category] = categoryProducts
                continue
            }

            categoryProducts.avg = avgCategoryPrice

            const priceRange = this.getModeratePriceRange(avgCategoryPrice)
            // limit number of docs = number_of_items_in_category * possible_decrease/increase_lvl
            const productsCollections = await Promise.all([
                this.dataServices.searchRepository.getProductsCheaperThan(
                    priceRange.lower,
                    cartIds,
                    category
                ),
                this.dataServices.searchRepository.getProductsWithinRange(
                    priceRange.lower,
                    priceRange.upper,
                    cartIds,
                    category
                ),
                this.dataServices.searchRepository.getProductsMoreExpensiveThan(
                    priceRange.upper,
                    cartIds,
                    category
                )
            ])

            const ranges = [PriceRangeType.LOWER, PriceRangeType.MIDDLE, PriceRangeType.UPPER]

            zip(productsCollections, ranges).forEach(([products, range]) => {
                if (!products) {
                    return
                }

                const filteredProducts: ResponseProductDto[] = products
                    .map((product) => ResponseProductDto.parseFromElastic(product)!)
                    .filter((p) => !!p)

                productsByPriceRanges[range] = filteredProducts

                productsByPriceRanges[range].forEach((el) => {
                    productsPriceRangeMap[el.id] = this.getPriceRange(el.price, priceRange)
                })
            })

            productsByCategories[category].forEach(
                (el) => (productsPriceRangeMap[el.product.id] = this.getPriceRange(el.product.price, priceRange))
            )

            categoryProducts.ranges = productsByPriceRanges
            priceRangesByCategories[category] = categoryProducts
        }

        const cheaperCarts = this.createCheaperCarts(
            initialCart,
            priceRangesByCategories,
            productsPriceRangeMap
        )
        const moreExpensiveCart = this.createMoreExpensiveCarts(
            initialCart,
            priceRangesByCategories,
            productsPriceRangeMap
        )

        return cheaperCarts.concat(moreExpensiveCart)
    }

    private createCheaperCarts(
        initialCart: PopulatedCartItem[],
        priceRangesByCategories: Record<string, CategoryProducts>,
        productsPriceRangeMap: Record<string, PriceRangeType>
    ): PopulatedCartItem[][] {
        let didUpdate = false
        const newCart: PopulatedCartItem[] = []

        const maximumPriceRange = initialCart.reduce(
            (max: PriceRangeType | null, entity: PopulatedCartItem) => {
                const priceRange = productsPriceRangeMap[entity.product.id]
                if (max === null || priceRange > max) {
                    return priceRange
                }
                return max
            },
            null
        )

        if ((maximumPriceRange ?? PriceRangeType.LOWER) === PriceRangeType.LOWER) {
            console.log("Price range limitation exit", maximumPriceRange)
            return []
        }

        for (const item of initialCart) {
            const itemPriceRange = productsPriceRangeMap[item.product.id]
            let loweredPriceRange = this.lowerRangeIfPossible(itemPriceRange)
            let substitution: ResponseProductDto | undefined = undefined

            // if there is no middle, check lower
            while (substitution === undefined) {
                const substitutions = priceRangesByCategories[item.product.category].ranges[
                    loweredPriceRange
                ].filter((product) => !newCart.some((p) => p.product.id === product.id))
                substitution = substitutions[Math.floor(Math.random() * substitutions.length)]
                loweredPriceRange = this.lowerRangeIfPossible(loweredPriceRange)

                if (loweredPriceRange === PriceRangeType.LOWER) {
                    break
                }
            }

            if (substitution) {
                if (itemPriceRange !== PriceRangeType.LOWER) {
                    didUpdate = true
                }
                /*
                    if product is perKilo and sub is perItem
                        floor() packs
                        if item is 0.32 kg and item is 0.14 we return 2 items (0.28 kg) not 3 (>0.32 fg)
                    
                    if product is perItem and sub is perKilo
                        get total weight and floor it to nearest numbeir divisible by 50g
                        if there are 2 items for 115g (230 in sum) we return 0.2 kg
                */

                let quantity = item.quantity

                if (item.product.isPricePerKilo && !substitution.isPricePerKilo) {
                    const weightPerItem = item.product.weightPerItem
                    quantity = Math.floor(item.quantity / weightPerItem)
                } else if (!item.product.isPricePerKilo && substitution.isPricePerKilo) {
                    const totalWeight = item.product.weightPerItem * item.quantity
                    quantity = this.getClosestWeight(totalWeight)
                }

                newCart.push(new PopulatedCartItem(quantity, substitution))
            } else {
                newCart.push(item)
            }
        }

        if (!didUpdate) {
            console.log("Cart did not update exit")
            return []
        }

        console.log("cheaper cart generated")
        const head = [newCart]
        const tail = this.createCheaperCarts(
            newCart,
            priceRangesByCategories,
            productsPriceRangeMap
        )

        return head.concat(tail)
    }

    private createMoreExpensiveCarts(
        initialCart: PopulatedCartItem[],
        priceRangesByCategories: Record<string, CategoryProducts>,
        productsPriceRangeMap: Record<string, PriceRangeType>
    ): PopulatedCartItem[][] {
        let didUpdate = false
        const newCart: PopulatedCartItem[] = []

        const minimumPriceRange = initialCart.reduce(
            (min: PriceRangeType | null, entity: PopulatedCartItem) => {
                const priceRange = productsPriceRangeMap[entity.product.id]
                if (min === null || priceRange < min) {
                    return priceRange
                }
                return min
            },
            null
        )

        if ((minimumPriceRange ?? PriceRangeType.UPPER) === PriceRangeType.UPPER) {
            console.log("MAX Price range limitation exit", minimumPriceRange)
            return []
        }

        for (const item of initialCart) {
            const itemPriceRange = productsPriceRangeMap[item.product.id]
            let upperPriceRange = this.upperRangeIfPossible(itemPriceRange)
            let substitution: ResponseProductDto | undefined = undefined

            // if there is no middle, check lower
            while (substitution === undefined) {
                const substitutions = priceRangesByCategories[item.product.category].ranges[
                    upperPriceRange
                ].filter((product) => !newCart.some((p) => p.product.id === product.id))
                substitution = substitutions[Math.floor(Math.random() * substitutions.length)]
                upperPriceRange = this.upperRangeIfPossible(upperPriceRange)

                if (upperPriceRange === PriceRangeType.UPPER) {
                    break
                }
            }

            if (substitution) {
                if (itemPriceRange !== PriceRangeType.UPPER) {
                    didUpdate = true
                }

                let quantity = item.quantity

                if (item.product.isPricePerKilo && !substitution.isPricePerKilo) {
                    const weightPerItem = item.product.weightPerItem
                    quantity = Math.ceil(item.quantity / weightPerItem)
                } else if (!item.product.isPricePerKilo && substitution.isPricePerKilo) {
                    const totalWeight = item.product.weightPerItem * item.quantity
                    quantity = this.getClosestWeight(totalWeight)
                }

                newCart.push(new PopulatedCartItem(quantity, substitution))
            } else {
                newCart.push(item)
            }
        }

        if (!didUpdate) {
            console.log("MAX Cart did not update exit")
            return []
        }

        console.log("more expensive cart generated")
        const head = [newCart]
        const tail = this.createMoreExpensiveCarts(
            newCart,
            priceRangesByCategories,
            productsPriceRangeMap
        )

        return head.concat(tail)
    }

    private getModeratePriceRange(middle: number): PriceRange {
        return {
            lower: middle * 0.6,
            upper: middle * 1.75
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private groupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K): Record<K, T[]> {
        return arr.reduce((groups, item) => {
            ;(groups[key(item)] ||= []).push(item)
            return groups
        }, {} as Record<K, T[]>)
    }

    private getPriceRange(price: number, moderateRange: PriceRange): PriceRangeType {
        if (price <= moderateRange.lower) {
            return PriceRangeType.LOWER
        }

        if (price >= moderateRange.upper) {
            return PriceRangeType.UPPER
        }

        return PriceRangeType.MIDDLE
    }

    private lowerRangeIfPossible(range: PriceRangeType): PriceRangeType {
        if (range === PriceRangeType.LOWER) {
            return PriceRangeType.LOWER
        }

        return range === PriceRangeType.UPPER ? PriceRangeType.MIDDLE : PriceRangeType.LOWER
    }

    private upperRangeIfPossible(range: PriceRangeType): PriceRangeType {
        if (range === PriceRangeType.UPPER) {
            return PriceRangeType.UPPER
        }

        return range === PriceRangeType.LOWER ? PriceRangeType.MIDDLE : PriceRangeType.UPPER
    }

    private getClosestWeight(weight: number) {
        return Math.round(weight / 0.05) * 0.05
    }
}

function zip<S1, S2>(firstCollection: Array<S1>, lastCollection: Array<S2>): Array<[S1, S2]> {
    const length = Math.min(firstCollection.length, lastCollection.length)
    const zipped: Array<[S1, S2]> = []

    for (let index = 0; index < length; index++) {
        zipped.push([firstCollection[index], lastCollection[index]])
    }

    return zipped
}
