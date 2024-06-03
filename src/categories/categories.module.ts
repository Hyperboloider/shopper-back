import { Module } from "@nestjs/common"
import { CategoriesService } from "./categories.service"
import { CategoriesController } from "./categories.controller"
import { CATEGORY_SERVICE } from "./icategories.service"
import { DataServiceModule } from "src/data/data-service.module"

@Module({
    providers: [
        {
            provide: CATEGORY_SERVICE,
            useClass: CategoriesService
        }
    ],
    controllers: [CategoriesController],
    imports: [DataServiceModule]
})
export class CategoriesModule {}
