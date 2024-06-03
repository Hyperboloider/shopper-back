import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Inject,
    Param,
    Post,
    UseGuards
} from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { Role } from "src/auth/enum"
import { UserId } from "src/auth/extensions/decorators"
import { UserRoles } from "src/auth/extensions/decorators/get-user-roles.decorator"
import { AccessGuard } from "src/auth/extensions/guards"
import { CreateOrderDto } from "./dto/create-order"
import { PopulatedResponseOrderDto } from "./dto/populated-response-order"
import { ResponseOrderDto } from "./dto/response-order.dto"
import { IOrdersService, ORDERS_SERVICE } from "./iorders.service"

@Controller("orders")
@UseGuards(AccessGuard)
export class OrdersController {
    constructor(
        @Inject(ORDERS_SERVICE)
        private ordersService: IOrdersService
    ) {}

    @ApiBearerAuth("access")
    @Get("user/:id")
    async getOrdersByUserId(
        @UserId() userId: string,
        @UserRoles() roles: Role[],
        @Param("id") id: string
    ): Promise<ResponseOrderDto[]> {
        if (userId == id || roles.includes(Role.Admin)) {
            return await this.ordersService.getOrders(id)
        }

        throw new ForbiddenException("Only admin is allowed to get other's orders")
    }

    @ApiBearerAuth("access")
    @Get(":id")
    async getOrderById(
        @UserId() userId: string,
        @UserRoles() roles: Role[],
        @Param("id") id: string
    ): Promise<PopulatedResponseOrderDto> {
        return this.ordersService.getOrderById(id, userId, roles)
    }

    @ApiBearerAuth("access")
    @Post()
    async addOrder(
        @UserId() userId: string,
        @Body() order: CreateOrderDto
    ): Promise<ResponseOrderDto> {
        return await this.ordersService.createOrder(userId, order)
    }
}
