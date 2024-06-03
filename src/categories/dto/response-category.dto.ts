import { ApiProperty } from "@nestjs/swagger"
import { CategoryDocument } from "src/data/schemas/category.schema"

export class ResponseCategoryDto {
    constructor(category: CategoryDocument) {
        this.id = String(category._id)
    }

    @ApiProperty()
    id: string
}
