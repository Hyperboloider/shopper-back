import { Model, Types } from "mongoose"
import { IProductRepository } from "../irepos/iproducts-repository"
import { Product, ProductDocument } from "../schemas"

export class ProductRepository implements IProductRepository {
    constructor(private _repository: Model<ProductDocument>) {}

    async create(product: Product): Promise<ProductDocument | null> {
        return await this._repository.create(product)
    }

    async getAll(): Promise<ProductDocument[]> {
        return await this._repository.find({}, {}, {}).exec()
    }

    async getById(id: string): Promise<ProductDocument | null> {
        return await this._repository.findById(id).exec()
    }

    async getByIds(ids: string[]): Promise<ProductDocument[]> {
        const objectIds = ids.map((id) => new Types.ObjectId(id))
        return await this._repository.find({ _id: { $in: objectIds } })
    }

    async getByUpc(upc: string): Promise<ProductDocument | null> {
        return await this._repository.findOne({ upc }).exec()
    }

    async deleteByUpc(upc: string): Promise<ProductDocument | null> {
        return await this._repository.findOneAndDelete({ upc }).exec()
    }
}
