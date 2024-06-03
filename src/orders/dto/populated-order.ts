import { ProductDocument } from "src/data/schemas"

export class PopulatedOrder {
    _id?: string
    creationDate!: Date
    creatorId!: string
    products!: { quantity: number; product: ProductDocument }[]
}
