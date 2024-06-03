import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
    ArrayMinSize,
    IsArray,
    IsMongoId,
    IsNumber,
    Max,
    Min,
    ValidateNested
} from "class-validator"

export class OrderItem {
    @ApiProperty()
    @IsNumber()
    @Min(0.05)
    @Max(30)
    quantity!: number

    @ApiProperty()
    @IsMongoId()
    product!: string
}

export class CreateOrderDto {
    @ApiProperty({
        isArray: true,
        type: OrderItem
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => OrderItem)
    products!: OrderItem[]
}
