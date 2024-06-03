import { CreateProductDto, ResponseProductDto } from "./dto"

export const PRODUCT_SERVICE = "PRODUCT_SERVICE"

export interface IProductService {
    getProducts(): Promise<ResponseProductDto[]>
    getProduct(id: string): Promise<ResponseProductDto>
    getProductByUpc(upc: string): Promise<ResponseProductDto>
    addProduct(
        createProductDto: CreateProductDto,
        file: Express.Multer.File
    ): Promise<ResponseProductDto>
    deleteProductByUpc(upc: string)
    //TODO: - add update method
}
