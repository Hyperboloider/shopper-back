import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { ProductsModule } from "./products/products.module"
import { CategoriesModule } from "./categories/categories.module"
import { SearchModule } from "./search/search.module"
import { APP_FILTER } from "@nestjs/core"
import { AllExceptionsFilter } from "./common/exception-filter"
import { OrdersModule } from "./orders/orders.module"
import { ShoppingListModule } from "./list/shopping-list.module"

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: "src/.env"
        }),
        UsersModule,
        AuthModule,
        ProductsModule,
        CategoriesModule,
        SearchModule,
        OrdersModule,
        ShoppingListModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter
        }
    ]
})
export class AppModule {}
