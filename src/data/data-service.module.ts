/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
    Product,
    ProductSchema,
    ShoppingList,
    ShoppingListSchema,
    Token,
    TokenSchema,
    User,
    UserSchema
} from "./schemas"
import { IDataService } from "./data-service/idata-service"
import { DataService } from "./data-service/data-service"
import { ConfigModule } from "@nestjs/config"
import { Category, CategorySchema } from "./schemas/category.schema"
import { Order, OrderSchema } from "./schemas/order.shema"
import { Client } from "@elastic/elasticsearch"
import { Invitation, InvitationSchema } from "./schemas/invitation.schema"

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: "src/.env"
        }),
        MongooseModule.forFeatureAsync([
            {
                name: Token.name,
                useFactory: () => {
                    return TokenSchema
                }
            },
            {
                name: User.name,
                useFactory: () => {
                    return UserSchema
                }
            },
            {
                name: Product.name,
                useFactory: () => {
                    const esClient = new Client({
                        cloud: {
                            id: String(process.env.ELASTIC_CLOUD_ID)
                        },
                        auth: {
                            username: String(process.env.ELASTIC_CLOUD_USERNAME),
                            password: String(process.env.ELASTIC_CLOUD_PASSWORD)
                        }
                    })

                    const schema = ProductSchema
                    schema.plugin(require("mongoosastic"), {
                        esClient: esClient
                    })

                    return schema
                }
            },
            {
                name: Category.name,
                useFactory: () => {
                    return CategorySchema
                }
            },
            {
                name: Order.name,
                useFactory: () => {
                    return OrderSchema
                }
            },
            {
                name: ShoppingList.name,
                useFactory: () => {
                    return ShoppingListSchema
                }
            },
            {
                name: Invitation.name,
                useFactory: () => {
                    return InvitationSchema
                }
            }
        ]),
        MongooseModule.forRoot(String(process.env.DB))
    ],
    exports: [IDataService],
    providers: [{ provide: IDataService, useClass: DataService }]
})
export class DataServiceModule {}
