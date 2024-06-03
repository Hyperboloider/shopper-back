import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type InvitationDocument = Invitation & Document

@Schema()
export class Invitation {
    @Prop({
        required: true
    })
    shoppingListId!: string
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation)
