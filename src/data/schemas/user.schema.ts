import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { Role } from "src/auth/enum"

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({
        required: true
    })
    firstName!: string

    @Prop({
        required: true
    })
    lastName!: string

    @Prop({
        required: true,
        unique: true
    })
    email!: string

    @Prop({
        required: true
    })
    password!: string

    @Prop({
        required: true
    })
    roles!: Role[]

    @Prop()
    socketId?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
