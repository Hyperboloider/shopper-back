import { Model } from "mongoose"
import { ICategoriesRepository } from "../irepos/icategories-repository"
import { Category, CategoryDocument } from "../schemas/category.schema"

export class CategoryRepository implements ICategoriesRepository {
    constructor(private _repository: Model<CategoryDocument>) {}

    async create(category: Category): Promise<CategoryDocument | null> {
        return await this._repository.create(category)
    }

    async getAll(): Promise<CategoryDocument[]> {
        return await this._repository.find({}, {}, {}).exec()
    }

    async getById(id: string): Promise<CategoryDocument | null> {
        return await this._repository.findById(id).exec()
    }

    async delete(id: string): Promise<CategoryDocument | null> {
        return await this._repository.findByIdAndRemove(id).exec()
    }
}
