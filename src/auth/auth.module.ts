import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { AUTH_SERVICE } from "./auth.service-interface"
import { DataServiceModule } from "src/data/data-service.module"
import { RefreshStrategy } from "./strategies/refresh.strategy"
import { AccessStrategy } from "./strategies/access.strategy"
import { JwtModule } from "@nestjs/jwt"

@Module({
    providers: [
        {
            provide: AUTH_SERVICE,
            useClass: AuthService
        },
        AccessStrategy,
        RefreshStrategy
    ],
    controllers: [AuthController],
    imports: [DataServiceModule, JwtModule.register({})]
})
export class AuthModule {}
