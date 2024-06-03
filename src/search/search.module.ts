import { Module } from "@nestjs/common"
import { SearchService } from "./search.service"
import { SearchController } from "./search.controller"
import { DataServiceModule } from "src/data/data-service.module"
import { SEARCH_SERVICE } from "./isearch.service"

@Module({
    providers: [
        {
            provide: SEARCH_SERVICE,
            useClass: SearchService
        }
    ],
    controllers: [SearchController],
    imports: [DataServiceModule]
})
export class SearchModule {}
