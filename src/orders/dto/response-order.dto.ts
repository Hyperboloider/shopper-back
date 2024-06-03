import { OrderDocument } from "src/data/schemas/order.shema"

export class ResponseOrderDto {
    constructor(order: OrderDocument) {
        this.id = String(order.id)
        this.creationDate = order.creationDate
        this.creatorId = order.creatorId
        this.products = order.products
    }

    id: string

    creationDate: Date

    creatorId: string

    products: { quantity: number; product: string }[]
}
