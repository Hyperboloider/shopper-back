import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
    IsArray,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    ValidateNested
} from "class-validator"

export class ShoppingListItemDto {
    @ApiProperty()
    @IsNumber()
    @Min(0.05)
    @Max(30)
    quantity!: number

    @ApiProperty()
    @IsMongoId()
    product!: string
}

export class CreateShoppingListDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({
        isArray: true,
        type: ShoppingListItemDto
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ShoppingListItemDto)
    products!: ShoppingListItemDto[]
}
