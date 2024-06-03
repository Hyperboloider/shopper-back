import { User, UserDocument } from "../schemas/user.schema"

export interface IUserRepository {
    create(user: User): Promise<UserDocument | null>
    getAll(): Promise<UserDocument[]>
    getById(id: string): Promise<UserDocument | null>
    getInIds(ids: string[]): Promise<UserDocument[] | null>
    getByEmail(email: string): Promise<UserDocument | null>
    delete(id: string): Promise<UserDocument | null>
    updateSocketId(userId: string, socketId: string | null): Promise<UserDocument | null>
}
