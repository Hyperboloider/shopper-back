import { PopulatedOrder } from "src/orders/dto/populated-order"
import { Order, OrderDocument } from "../schemas/order.shema"

export interface IOrderRepository {
    create(order: Order): Promise<OrderDocument | null>
    getById(id: string): Promise<PopulatedOrder | null>
    getAll(creatorId: string): Promise<OrderDocument[]>
}
