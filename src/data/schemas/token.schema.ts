import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types, Document } from "mongoose"

export type TokenDocument = Token & Document

@Schema()
export class Token {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: "User"
    })
    userId!: string

    @Prop({
        required: true
    })
    token!: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)
