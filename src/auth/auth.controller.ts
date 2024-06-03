import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from "@nestjs/common"
import { CreateUserDto } from "src/users/dto"
import { AUTH_SERVICE, IAuthService } from "./auth.service-interface"
import { CredntialsDto, Tokens } from "./dto"
import { ApiBearerAuth } from "@nestjs/swagger"
import { AccessGuard, RefreshGuard } from "./extensions/guards"
import { UserId, UserToken } from "./extensions/decorators"

@Controller("auth")
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE)
        private authService: IAuthService
    ) {}

    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
        return await this.authService.signUp(createUserDto)
    }

    @Post("signin")
    async signIn(@Body() credentials: CredntialsDto): Promise<Tokens> {
        return await this.authService.signIn(credentials)
    }

    @ApiBearerAuth("access")
    @UseGuards(AccessGuard)
    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    async logOut(@UserId() userId: string) {
        await this.authService.logout(userId)
    }

    @ApiBearerAuth("access")
    @UseGuards(RefreshGuard)
    @Post("refresh")
    async refresh(@UserId() userId: string, @UserToken() token: string): Promise<Tokens> {
        return await this.authService.refresh(userId, token)
    }
}
