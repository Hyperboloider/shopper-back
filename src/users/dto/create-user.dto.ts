import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    firstName!: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    lastName!: string

    @ApiProperty()
    @IsEmail()
    email!: string

    @ApiProperty()
    @IsString()
    @MinLength(8)
    password!: string
}
