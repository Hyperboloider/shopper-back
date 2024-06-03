import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException
} from "@nestjs/common"
import { IDataService } from "src/data/data-service/idata-service"
import { Product, ProductDocument } from "src/data/schemas"
import { FileData } from "src/files/file-date"
import { FilesService } from "src/files/files.service"
import { ResponseProductDto, CreateProductDto } from "./dto"
import { IProductService } from "./iproduct.service"

@Injectable()
export class ProductsService implements IProductService {
    @Inject(FilesService)
    private readonly filesService!: FilesService

    constructor(private dataServices: IDataService) {}

    async getProduct(id: string): Promise<ResponseProductDto> {
        const product = await this.getUnwrapperUserId(id)
        return ResponseProductDto.parseFromDocument(product)
    }

    async getProductByUpc(upc: string): Promise<ResponseProductDto> {
        const product = await this.dataServices.productRepository.getByUpc(upc)
        if (!product) {
            throw new NotFoundException()
        }

        return ResponseProductDto.parseFromDocument(product)
    }

    async getProducts(): Promise<ResponseProductDto[]> {
        return (await this.dataServices.productRepository.getAll()).map((x) =>
            ResponseProductDto.parseFromDocument(x)
        )
    }

    async addProduct(
        createProductDto: CreateProductDto,
        file: Express.Multer.File
    ): Promise<ResponseProductDto> {
        const existingProduct = await this.dataServices.productRepository.getByUpc(
            createProductDto.upc
        )

        if (existingProduct) {
            throw new UnprocessableEntityException("Upc is taken!")
        }

        let imageData: FileData | undefined = undefined
        if (file) {
            imageData = await this.filesService.uploadPublicFile(file.buffer, file.originalname)
        }

        const product: Product = {
            ...createProductDto,
            imageUrl: imageData?.url,
            imageKey: imageData?.name
        }

        const createdProduct = await this.dataServices.productRepository.create(product)
        if (!createdProduct) {
            throw new InternalServerErrorException()
        }

        return ResponseProductDto.parseFromDocument(createdProduct)
    }

    async deleteProductByUpc(upc: string) {
        const deletedProduct = await this.dataServices.productRepository.deleteByUpc(upc)
        if (deletedProduct?.imageKey) {
            await this.filesService.deletePublicFile(deletedProduct.imageKey)
        }
        if (!deletedProduct) {
            throw new NotFoundException()
        }
    }

    private async getUnwrapperUserId(id: string): Promise<ProductDocument> {
        const product = await this.dataServices.productRepository.getById(id)

        if (!product) {
            throw new NotFoundException()
        }

        return product
    }
}
