import { TokenDocument } from "../schemas/token.schema"

export interface ITokenRepository {
    getByUserId(userId: string): Promise<TokenDocument | null>
    removeByUserId(userId: string): Promise<TokenDocument | null>
    create(token: string, userId: string): Promise<TokenDocument | null>
    update(token: string, userId: string): Promise<TokenDocument | null>
}
