import { Product, ProductDocument } from "../schemas"

export interface IProductRepository {
    create(product: Product): Promise<ProductDocument | null>
    getAll(): Promise<ProductDocument[]>
    getById(id: string): Promise<ProductDocument | null>
    getByIds(ids: string[]): Promise<ProductDocument[]>
    getByUpc(upc: string): Promise<ProductDocument | null>
    deleteByUpc(upc: string): Promise<ProductDocument | null>
}
