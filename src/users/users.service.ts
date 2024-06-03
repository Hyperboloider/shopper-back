import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common"
import { Role } from "src/auth/enum"
import { IDataService } from "src/data/data-service/idata-service"
import { User, UserDocument } from "src/data/schemas/user.schema"
import { CompactUserResponse, CreateUserDto, ResponseUserDto } from "./dto"
import { IUsersService } from "./users.service-interface"

@Injectable()
export class UsersService implements IUsersService {
    constructor(private dataServices: IDataService) {}

    async createUser(userDto: CreateUserDto): Promise<ResponseUserDto> {
        const registeredUser = await this.dataServices.userRepository.getByEmail(userDto.email)
        if (registeredUser) {
            throw new BadRequestException("This email is already in use")
        }

        const newUser: User = {
            ...userDto,
            roles: [Role.User]
        }

        const createdUser = await this.dataServices.userRepository.create(newUser)
        if (!createdUser) {
            throw new InternalServerErrorException()
        }

        return new ResponseUserDto(createdUser)
    }

    async getUsers(): Promise<ResponseUserDto[]> {
        const users = await this.dataServices.userRepository.getAll()
        return users.map((x) => new ResponseUserDto(x))
    }

    async getUser(id: string): Promise<ResponseUserDto> {
        const user = await this.getUnwrappedUserById(id)
        return new ResponseUserDto(user)
    }

    async getUserByEmail(email: string): Promise<ResponseUserDto> {
        const user = await this.dataServices.userRepository.getByEmail(email)

        if (!user) {
            throw new NotFoundException()
        }

        return new ResponseUserDto(user)
    }

    async getCompactInfo(ids: string[]): Promise<CompactUserResponse[]> {
        const users = await this.dataServices.userRepository.getInIds(ids)
        if (!users) {
            throw new NotFoundException()
        }

        return users.map((u) => new CompactUserResponse(u))
    }

    async delete(id: string): Promise<ResponseUserDto> {
        const user = await this.getUnwrappedUserById(id)
        await this.dataServices.userRepository.delete(id)
        return new ResponseUserDto(user)
    }

    async setSocketId(userId: string, socketId: string | null) {
        await this.dataServices.userRepository.updateSocketId(userId, socketId)
    }

    private async getUnwrappedUserById(id: string): Promise<UserDocument> {
        const user = await this.dataServices.userRepository.getById(id)

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }
}
