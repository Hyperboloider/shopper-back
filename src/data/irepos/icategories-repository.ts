import { Category, CategoryDocument } from "../schemas/category.schema"

export interface ICategoriesRepository {
    create(category: Category): Promise<CategoryDocument | null>
    getAll(): Promise<CategoryDocument[]>
    getById(id: string): Promise<CategoryDocument | null>
    delete(id: string): Promise<CategoryDocument | null>
}
