import { Model } from "mongoose"
import { ITokenRepository } from "../irepos"
import { TokenDocument } from "../schemas"

export class TokenRepository implements ITokenRepository {
    constructor(private _repository: Model<TokenDocument>) {}

    async getByUserId(userId: string): Promise<TokenDocument | null> {
        return await this._repository.findOne({ userId }).exec()
    }

    async removeByUserId(userId: string): Promise<TokenDocument | null> {
        return await this._repository.findOneAndRemove({ userId }).exec()
    }

    async create(token: string, userId: string): Promise<TokenDocument | null> {
        return await this._repository.create({ token, userId })
    }

    async update(token: string, userId: string): Promise<TokenDocument | null> {
        return await this._repository.findOneAndUpdate({ userId }, { token }, { new: true })
    }
}
