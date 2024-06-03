import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId, IsNumber, Max, Min } from "class-validator"

export class CartItem {
    @ApiProperty()
    @IsNumber()
    @IsNumber()
    @Min(1)
    @Max(30)
    quantity!: number

    @ApiProperty()
    @IsMongoId()
    product!: string
}
