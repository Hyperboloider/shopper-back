import { ResponseProductDto } from "src/products/dto"
import { PopulatedOrder } from "./populated-order"

export class PopulatedResponseOrderDto {
    constructor(order: PopulatedOrder) {
        this.id = String(order._id)
        this.creationDate = order.creationDate
        this.creatorId = order.creatorId
        this.products = order.products.map((x) => {
            return {
                quantity: x.quantity,
                product: ResponseProductDto.parseFromDocument(x.product)
            }
        })
    }

    id: string

    creationDate: Date

    creatorId: string

    products: { quantity: number; product: ResponseProductDto }[]
}
