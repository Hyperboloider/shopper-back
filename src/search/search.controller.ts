import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Query,
    UseGuards
} from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { AccessGuard } from "src/auth/extensions/guards"
import { ResponseProductDto } from "src/products/dto"
import { CartItem, PopulatedCartItem } from "./dto"
import { OptimisationDTO } from "./dto/optimisation.dto"
import { ISearchService, SEARCH_SERVICE } from "./isearch.service"

@Controller("search")
@UseGuards(AccessGuard)
export class SearchController {
    constructor(
        @Inject(SEARCH_SERVICE)
        private productsService: ISearchService
    ) {}

    @ApiBearerAuth("access")
    @Get("autocomplete")
    async autocomplete(@Query("query") query?: string): Promise<ResponseProductDto[]> {
        if (!query) {
            throw new BadRequestException("Provide query param")
        }

        return await this.productsService.getAutocompleteProductsForQuery(query)
    }

    @ApiBearerAuth("access")
    @Post("similarCarts")
    async getSimilarCarts(@Body() cart: CartItem[]): Promise<PopulatedCartItem[][]> {
        return await this.productsService.getSimilarCarts(cart)
    }

    @ApiBearerAuth("access")
    @Post("minimax")
    async minimax(@Body() request: OptimisationDTO): Promise<ResponseProductDto[]> {
        return await this.productsService.getMaximixProducts(request)
    }
}
