import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { Role } from "src/auth/enum"
import { SetRoles, UserId } from "src/auth/extensions/decorators"
import { AccessGuard } from "src/auth/extensions/guards"
import { RoleGuard } from "src/auth/extensions/guards/role.guard"
import { CompactUserResponse, ResponseUserDto } from "./dto"
import { IUsersService, USERS_SERVICE } from "./users.service-interface"

@Controller("users")
export class UsersController {
    constructor(
        @Inject(USERS_SERVICE)
        private usersService: IUsersService
    ) {}

    @ApiBearerAuth("access")
    @Get()
    @UseGuards(AccessGuard, RoleGuard)
    @SetRoles(Role.Admin)
    async getAll(): Promise<ResponseUserDto[]> {
        return await this.usersService.getUsers()
    }

    @ApiBearerAuth("access")
    @UseGuards(AccessGuard)
    @Get("profile")
    async getById(@UserId() id: string): Promise<ResponseUserDto> {
        return await this.usersService.getUser(id)
    }

    @ApiBearerAuth("access")
    @UseGuards(AccessGuard)
    @Post("compactInfo")
    async getCompactInfo(@Body() ids: string[]): Promise<CompactUserResponse[]> {
        return await this.usersService.getCompactInfo(ids)
    }
}
