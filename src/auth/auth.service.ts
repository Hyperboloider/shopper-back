import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException
} from "@nestjs/common"
import { IDataService } from "src/data/data-service/idata-service"
import { Token, User } from "src/data/schemas"
import { CreateUserDto } from "src/users/dto"
import { IAuthService } from "./auth.service-interface"
import { hash, compare } from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { Tokens } from "./dto/tokens.dto"
import { CredntialsDto } from "./dto"
import { Role } from "./enum"

@Injectable()
export class AuthService implements IAuthService {
    constructor(private dataServices: IDataService, private jwtService: JwtService) {}

    async signUp(userDto: CreateUserDto): Promise<Tokens> {
        const registeredUser = await this.dataServices.userRepository.getByEmail(userDto.email)
        if (registeredUser) {
            throw new BadRequestException("This email is already in use")
        }

        const newUser: User = {
            ...userDto,
            roles: [Role.User]
        }

        newUser.password = await hash(newUser.password, Number(process.env.SALT))

        const createdUser = await this.dataServices.userRepository.create(newUser)
        if (!createdUser) {
            throw new InternalServerErrorException()
        }

        const tokens = await this.generateTokens(
            String(createdUser.id),
            createdUser.email,
            createdUser.roles
        )
        await this.updateOrCreateToken(tokens.refreshToken, String(createdUser.id))
        return tokens
    }

    async signIn(credentials: CredntialsDto): Promise<Tokens> {
        const user = await this.dataServices.userRepository.getByEmail(credentials.email)
        if (!user) {
            throw new ForbiddenException()
        }

        const doesPasswordMatch = await compare(credentials.password, user.password)
        if (!doesPasswordMatch) {
            throw new ForbiddenException()
        }

        const tokens = await this.generateTokens(String(user.id), user.email, user.roles)
        await this.updateOrCreateToken(tokens.refreshToken, String(user.id))
        return tokens
    }

    async logout(userId: string): Promise<void> {
        await this.dataServices.tokenRepository.removeByUserId(userId)
    }

    async refresh(userId: string, token: string): Promise<Tokens> {
        const user = await this.dataServices.userRepository.getById(userId)
        if (!user) {
            throw new ForbiddenException("Invalide user")
        }

        const existingToken = await this.dataServices.tokenRepository.getByUserId(userId)
        if (!existingToken) {
            throw new ForbiddenException("No saved token")
        }

        const tokensMatch = token === existingToken.token
        if (!tokensMatch) {
            throw new ForbiddenException("Tokens mismatch")
        }

        const tokens = await this.generateTokens(String(user.id), user.email, user.roles)
        tokens.refreshToken = token
        return tokens
    }

    private async generateTokens(id: string, email: string, roles: Role[]): Promise<Tokens> {
        const accessToken = await this.jwtService.signAsync(
            {
                email,
                sub: id,
                roles
            },
            {
                secret: String(process.env.ACCESS_SALT),
                expiresIn: Number(process.env.ACCESS_LIFETIME)
            }
        )

        const refreshToken = await this.jwtService.signAsync(
            {
                email,
                sub: id,
                roles
            },
            {
                secret: String(process.env.REFRESH_SALT),
                expiresIn: Number(process.env.REFRESH_LIFETIME)
            }
        )

        return new Tokens(refreshToken, accessToken)
    }

    private async updateOrCreateToken(token: string, userId: string): Promise<Token | null> {
        const existingToken = await this.dataServices.tokenRepository.getByUserId(userId)
        if (!existingToken) {
            await this.dataServices.tokenRepository.removeByUserId(userId)
            return await this.dataServices.tokenRepository.create(token, userId)
        }

        return await this.dataServices.tokenRepository.update(token, userId)
    }
}
