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
    UseGuards
} from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { Role } from "src/auth/enum"
import { SetRoles } from "src/auth/extensions/decorators"
import { AccessGuard } from "src/auth/extensions/guards"
import { RoleGuard } from "src/auth/extensions/guards/role.guard"
import { CreateCategoryDto, ResponseCategoryDto } from "./dto"
import { CATEGORY_SERVICE, ICategoryService } from "./icategories.service"

@Controller("categories")
@UseGuards(AccessGuard)
export class CategoriesController {
    constructor(
        @Inject(CATEGORY_SERVICE)
        private categoriesService: ICategoryService
    ) {}

    @ApiBearerAuth("access")
    @Get()
    async getAll(): Promise<ResponseCategoryDto[]> {
        return await this.categoriesService.getCategories()
    }

    @ApiBearerAuth("access")
    @Get(":id")
    async getCategoryById(@Param("id") id: string): Promise<ResponseCategoryDto> {
        return await this.categoriesService.getCategory(id)
    }

    @ApiBearerAuth("access")
    @Post()
    @UseGuards(RoleGuard)
    @SetRoles(Role.Admin)
    async addCategory(@Body() category: CreateCategoryDto): Promise<ResponseCategoryDto> {
        return await this.categoriesService.addCategory(category)
    }

    @ApiBearerAuth("access")
    @Delete("delete/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RoleGuard)
    @SetRoles(Role.Admin)
    async deleteProduct(@Param("id") id: string) {
        await this.categoriesService.deleteCategory(id)
    }
}
