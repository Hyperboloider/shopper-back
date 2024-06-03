import { ProductDocument } from "src/data/schemas"

export class PopulatedShoppingList {
    _id?: string
    creationDate!: Date
    creatorId!: string
    name!: string
    users!: string[]
    products!: { bought: number; quantity: number; product: ProductDocument }[]
}
