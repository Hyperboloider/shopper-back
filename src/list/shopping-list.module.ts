import { Module } from "@nestjs/common"
import { ShoppingListService } from "./shopping-list.service"
import { ShoppingListController } from "./shopping-list.controller"
import { DataServiceModule } from "src/data/data-service.module"
import { SHOPPING_LIST_SERVICE } from "./ishpping-list.service"
import { ShoppingListGateway } from "./websocket/shoppig-list.gateway"
import { USERS_SERVICE } from "src/users/users.service-interface"
import { UsersService } from "src/users/users.service"

@Module({
    providers: [
        {
            provide: USERS_SERVICE,
            useClass: UsersService
        },
        {
            provide: SHOPPING_LIST_SERVICE,
            useClass: ShoppingListService
        },
        ShoppingListGateway
    ],
    controllers: [ShoppingListController],
    imports: [DataServiceModule]
})
export class ShoppingListModule {}
