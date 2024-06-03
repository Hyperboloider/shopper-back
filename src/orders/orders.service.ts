import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common"
import { Role } from "src/auth/enum"
import { IDataService } from "src/data/data-service/idata-service"
import { Order } from "src/data/schemas/order.shema"
import { CreateOrderDto } from "./dto/create-order"
import { PopulatedResponseOrderDto } from "./dto/populated-response-order"
import { ResponseOrderDto } from "./dto/response-order.dto"
import { IOrdersService } from "./iorders.service"

@Injectable()
export class OrdersService implements IOrdersService {
    constructor(private dataServices: IDataService) {}

    async getOrders(id: string): Promise<ResponseOrderDto[]> {
        return (await this.dataServices.orderRepository.getAll(id)).map(
            (x) => new ResponseOrderDto(x)
        )
    }

    async createOrder(
        creatorId: string,
        createOrderDto: CreateOrderDto
    ): Promise<ResponseOrderDto> {
        const order: Order = {
            ...createOrderDto,
            creatorId: creatorId,
            creationDate: new Date()
        }

        const created = await this.dataServices.orderRepository.create(order)
        if (!created) {
            throw new InternalServerErrorException()
        }

        return new ResponseOrderDto(created)
    }

    async getOrderById(id: string, requesterId: string, requesterRole: Role[]) {
        const order = await this.dataServices.orderRepository.getById(id)
        if (!order) {
            throw new NotFoundException()
        }

        if (String(order.creatorId) != requesterId && !requesterRole.includes(Role.Admin)) {
            throw new ForbiddenException("User may request only own orders")
        }

        return new PopulatedResponseOrderDto(order)
    }
}
