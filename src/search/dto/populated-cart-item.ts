import { ApiProperty } from "@nestjs/swagger"
import { ResponseProductDto } from "src/products/dto"

export class PopulatedCartItem {
    @ApiProperty()
    quantity: number

    @ApiProperty()
    product: ResponseProductDto

    constructor(quantity: number, product: ResponseProductDto) {
        this.quantity = quantity
        this.product = product
    }
}
