import { ApiProperty } from "@nestjs/swagger"
import { Role } from "src/auth/enum"
import { UserDocument } from "src/data/schemas"

export class ResponseUserDto {
    constructor(user: UserDocument) {
        this.id = String(user.id)
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
        this.roles = user.roles
        this.socketId = user.socketId
    }

    @ApiProperty()
    id: string

    @ApiProperty()
    firstName: string

    @ApiProperty()
    lastName: string

    @ApiProperty()
    email: string

    @ApiProperty()
    roles: Role[]

    @ApiProperty()
    socketId?: string
}
