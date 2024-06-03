import { CreateUserDto, ResponseUserDto } from "./dto"
import { CompactUserResponse } from "./dto/compact-user-response.dto"

export const USERS_SERVICE = "USERS_SERVICE"

export interface IUsersService {
    createUser(userDto: CreateUserDto): Promise<ResponseUserDto>
    getUsers(): Promise<ResponseUserDto[]>
    getUser(id: string): Promise<ResponseUserDto>
    getCompactInfo(ids: string[]): Promise<CompactUserResponse[]>
    setSocketId(userId: string, socketId: string | null)
    getUserByEmail(email: string): Promise<ResponseUserDto>
    delete(id: string): Promise<ResponseUserDto>
}
