import { Role } from "src/auth/enum"
import { CreateOrderDto } from "./dto/create-order"
import { PopulatedResponseOrderDto } from "./dto/populated-response-order"
import { ResponseOrderDto } from "./dto/response-order.dto"

export const ORDERS_SERVICE = "ORDERS_SERVICE"

export interface IOrdersService {
    getOrders(id: string): Promise<ResponseOrderDto[]>
    getOrderById(
        id: string,
        requesterId: string,
        requesterRole: Role[]
    ): Promise<PopulatedResponseOrderDto>
    createOrder(creatorId: string, createOrderDto: CreateOrderDto): Promise<ResponseOrderDto>
}
