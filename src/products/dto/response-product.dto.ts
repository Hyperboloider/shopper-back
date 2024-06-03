import { SearchHit } from "@elastic/elasticsearch/lib/api/types"
import { ProductDocument } from "src/data/schemas"
import { ElasticProductSource } from "src/search/elastic.response/elastic-product-response.dto"

export class ResponseProductDto {
    id: string

    name: string

    description: string

    upc: string

    price: number

    isPricePerKilo: boolean

    weightPerItem: number

    caloriesPer100g?: number

    protein?: number

    fat?: number

    carb?: number

    category!: string

    imageUrl?: string

    imageKey?: string

    constructor(
        id: string,
        name: string,
        description: string,
        upc: string,
        price: number,
        isPricePerKilo: boolean,
        category: string,
        weightPerItem: number,
        caloriesPer100g?: number,
        protein?: number,
        fat?: number,
        carb?: number,
        imageUrl?: string,
        imageKey?: string
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.upc = upc
        this.price = price
        this.isPricePerKilo = isPricePerKilo
        this.category = category
        this.weightPerItem = weightPerItem
        this.caloriesPer100g = caloriesPer100g
        this.protein = protein
        this.fat = fat
        this.carb = carb
        this.imageUrl = imageUrl
        this.imageKey = imageKey
    }

    static parseFromDocument(product: ProductDocument): ResponseProductDto {
        return new ResponseProductDto(
            String(product.id),
            product.name,
            product.description,
            product.upc,
            product.price,
            product.isPricePerKilo,
            product.categoryId,
            product.weightPerItem,
            product.caloriesPer100g,
            product.protein,
            product.fat,
            product.carb,
            product.imageUrl,
            product.imageKey
        )
    }

    static parseFromElastic(product: SearchHit<ElasticProductSource>): ResponseProductDto | null {
        if (!product._source) {
            return null
        }

        return new ResponseProductDto(
            String(product._id),
            product._source.name,
            product._source.description,
            product._source.upc,
            product._source.price,
            product._source.isPricePerKilo,
            product._source.categoryId,
            product._source.weightPerItem,
            product._source.caloriesPer100g,
            product._source.protein,
            product._source.fat,
            product._source.carb,
            product._source.imageUrl,
            product._source.imageKey
        )
    }
}
