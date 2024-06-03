import { Model } from "mongoose"
import { PopulatedOrder } from "src/orders/dto/populated-order"
import { IOrderRepository } from "../irepos/iorders-repository"
import { Order, OrderDocument } from "../schemas/order.shema"

export class OrderRepository implements IOrderRepository {
    constructor(private _repository: Model<OrderDocument>) {}

    async create(order: Order): Promise<OrderDocument | null> {
        return await this._repository.create(order)
    }

    async getById(id: string): Promise<PopulatedOrder | null> {
        return (await this._repository
            .findById(id)
            .populate("products.product")
            .exec()) as unknown as PopulatedOrder
    }

    async getAll(id: string): Promise<OrderDocument[]> {
        return await this._repository.find({ creatorId: id }, {}, {}).exec()
    }
}
