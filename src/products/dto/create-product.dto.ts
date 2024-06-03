import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from "class-validator"

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description!: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    upc!: string

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    price!: number

    @ApiProperty()
    @Type(() => Boolean)
    @IsBoolean()
    @IsNotEmpty()
    isPricePerKilo!: boolean

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    weightPerItem!: number

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    caloriesPer100g!: number

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    protein!: number

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    fat!: number

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    carb!: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    categoryId!: string
}
