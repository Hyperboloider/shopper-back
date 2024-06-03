import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { IDataService } from "src/data/data-service/idata-service"
import { Category, CategoryDocument } from "src/data/schemas/category.schema"
import { ResponseCategoryDto, CreateCategoryDto } from "./dto"
import { ICategoryService } from "./icategories.service"

@Injectable()
export class CategoriesService implements ICategoryService {
    constructor(private dataServices: IDataService) {}

    async getCategories(): Promise<ResponseCategoryDto[]> {
        return (await this.dataServices.categoryRepository.getAll()).map(
            (x) => new ResponseCategoryDto(x)
        )
    }

    async getCategory(id: string): Promise<ResponseCategoryDto> {
        const category = await this.getUnwrappedCategory(id)
        return new ResponseCategoryDto(category)
    }

    async addCategory(createProductDto: CreateCategoryDto): Promise<ResponseCategoryDto> {
        const category: Category = {
            _id: createProductDto.name
        }

        const createdCategory = await this.dataServices.categoryRepository.create(category)

        if (!createdCategory) {
            throw new InternalServerErrorException()
        }

        return new ResponseCategoryDto(createdCategory)
    }

    async deleteCategory(id: string) {
        const deletedCategory = await this.dataServices.categoryRepository.delete(id)
        if (!deletedCategory) {
            throw new NotFoundException("category does not exist")
        }
    }

    private async getUnwrappedCategory(id: string): Promise<CategoryDocument> {
        const category = await this.dataServices.categoryRepository.getById(id)

        if (!category) {
            throw new NotFoundException()
        }

        return category
    }
}
