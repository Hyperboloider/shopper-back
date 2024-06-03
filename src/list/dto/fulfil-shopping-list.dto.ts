import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator"
import { ShoppingListItemDto } from "./create-shopping-list.dto"

export class ListFulfillmentDto {
    @ApiProperty({
        isArray: true,
        type: String
    })
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => String)
    listsIds!: string[]

    @ApiProperty({
        isArray: true,
        type: ShoppingListItemDto
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ShoppingListItemDto)
    products!: ShoppingListItemDto[]
}
