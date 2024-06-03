import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger"
import { Role } from "src/auth/enum"
import { SetRoles } from "src/auth/extensions/decorators"
import { AccessGuard } from "src/auth/extensions/guards"
import { RoleGuard } from "src/auth/extensions/guards/role.guard"
import { CreateProductDto, ResponseProductDto } from "./dto"
import { IProductService, PRODUCT_SERVICE } from "./iproduct.service"

@Controller("products")
@UseGuards(AccessGuard)
export class ProductsController {
    constructor(
        @Inject(PRODUCT_SERVICE)
        private productsService: IProductService
    ) {}

    @ApiBearerAuth("access")
    @Get()
    @UseGuards(RoleGuard)
    @SetRoles(Role.Admin)
    async getAll(): Promise<ResponseProductDto[]> {
        return await this.productsService.getProducts()
    }

    @ApiBearerAuth("access")
    @Get(":id")
    async getProductById(@Param("id") id: string): Promise<ResponseProductDto> {
        return await this.productsService.getProduct(id)
    }

    @ApiBearerAuth("access")
    @Get("upc/:upc")
    async getProductByByUpc(@Param("upc") upc: string): Promise<ResponseProductDto> {
        return await this.productsService.getProductByUpc(upc)
    }

    @ApiBearerAuth("access")
    @ApiConsumes("multipart/form-data")
    @Post()
    @UseGuards(RoleGuard)
    @SetRoles(Role.Admin)
    @UseInterceptors(FileInterceptor("file"))
    async addProduct(
        @Body() product: CreateProductDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ResponseProductDto> {
        return await this.productsService.addProduct(product, file)
    }

    @ApiBearerAuth("access")
    @Delete("upc/:upc")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RoleGuard)
    @SetRoles(Role.Admin)
    async deleteProduct(@Param("upc") upc: string) {
        await this.productsService.deleteProductByUpc(upc)
    }
}
