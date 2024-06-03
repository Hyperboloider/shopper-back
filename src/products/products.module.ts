import { Module } from "@nestjs/common"
import { ProductsService } from "./products.service"
import { ProductsController } from "./products.controller"
import { PRODUCT_SERVICE } from "./iproduct.service"
import { DataServiceModule } from "src/data/data-service.module"
import { FilesService } from "src/files/files.service"

@Module({
    providers: [
        {
            provide: PRODUCT_SERVICE,
            useClass: ProductsService
        },
        FilesService
    ],
    controllers: [ProductsController],
    imports: [DataServiceModule]
})
export class ProductsModule {}
