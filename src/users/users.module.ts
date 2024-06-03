import { Module } from "@nestjs/common"
import { DataServiceModule } from "src/data/data-service.module"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { USERS_SERVICE } from "./users.service-interface"

@Module({
    controllers: [UsersController],
    providers: [
        {
            provide: USERS_SERVICE,
            useClass: UsersService
        }
    ],
    imports: [DataServiceModule]
})
export class UsersModule {}
