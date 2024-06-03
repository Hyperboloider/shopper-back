import { CreateUserDto } from "src/users/dto"
import { CredntialsDto, Tokens } from "./dto"

export const AUTH_SERVICE = "AUTH_SERVICE"

export interface IAuthService {
    signUp(userDto: CreateUserDto): Promise<Tokens>
    signIn(credentials: CredntialsDto): Promise<Tokens>
    logout(userId: string): Promise<void>
    refresh(userId: string, token: string): Promise<Tokens>
}
