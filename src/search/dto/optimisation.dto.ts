import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsArray, IsBoolean, IsString, IsNotEmpty, ArrayNotEmpty } from "class-validator"
import { OptimisationOption } from "../enum"

export class OptimisationOptionDTO {
    @ApiProperty()
    @IsBoolean()
    isMax!: boolean

    @ApiProperty()
    @IsEnum(OptimisationOption)
    option!: OptimisationOption
}

export class OptimisationDTO {
    @ApiProperty({ type: String, isArray: true })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ArrayNotEmpty()
    categories!: string[]

    @ApiProperty({ type: OptimisationOptionDTO, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    options!: OptimisationOptionDTO[]
}
