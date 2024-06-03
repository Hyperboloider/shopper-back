import { Module } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { OrdersController } from "./orders.controller"
import { DataServiceModule } from "src/data/data-service.module"
import { ORDERS_SERVICE } from "./iorders.service"

@Module({
    providers: [
        {
            provide: ORDERS_SERVICE,
            useClass: OrdersService
        }
    ],
    controllers: [OrdersController],
    imports: [DataServiceModule]
})
export class OrdersModule {}
