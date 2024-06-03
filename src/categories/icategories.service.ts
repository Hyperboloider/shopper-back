import { ResponseCategoryDto, CreateCategoryDto } from "./dto"

export const CATEGORY_SERVICE = "CATEGORY_SERVICE"

export interface ICategoryService {
    getCategories(): Promise<ResponseCategoryDto[]>
    getCategory(id: string): Promise<ResponseCategoryDto>
    addCategory(createProductDto: CreateCategoryDto): Promise<ResponseCategoryDto>
    deleteCategory(id: string)
}
