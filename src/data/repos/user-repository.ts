import { Model, Types } from "mongoose"
import { IUserRepository } from "../irepos"
import { User, UserDocument } from "../schemas"

export class UserRepository implements IUserRepository {
    constructor(private _repository: Model<UserDocument>) {}

    async create(user: User): Promise<UserDocument | null> {
        return this._repository.create(user)
    }

    async getAll(): Promise<UserDocument[]> {
        return this._repository.find({}, {}, {}).exec()
    }

    async getById(id: string): Promise<UserDocument | null> {
        return this._repository.findById(id).exec()
    }

    async getInIds(ids: string[]): Promise<UserDocument[] | null> {
        const objectIds = ids.map((id) => new Types.ObjectId(id))
        return await this._repository.find({ _id: { $in: objectIds } })
    }

    async getByEmail(email: string): Promise<UserDocument | null> {
        return this._repository.findOne({ email }).exec()
    }

    async delete(id: string): Promise<UserDocument | null> {
        return this._repository.findByIdAndRemove(id).exec()
    }

    async updateSocketId(userId: string, socketId: string | null): Promise<UserDocument | null> {
        return this._repository
            .findByIdAndUpdate(userId, { $set: { socketId: socketId } }, { new: true })
            .exec()
    }
}
