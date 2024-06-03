import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, ValidateNested, ArrayMinSize } from "class-validator"
import { ShoppingListItemDto } from "./create-shopping-list.dto"

export class UpdateShoppingListDto {
    @ApiProperty({
        isArray: true,
        type: ShoppingListItemDto
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ShoppingListItemDto)
    products?: ShoppingListItemDto[]
}
