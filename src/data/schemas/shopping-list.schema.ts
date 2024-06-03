import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types, Document } from "mongoose"

export type ShoppingListDocument = ShoppingList & Document

@Schema()
export class ShoppingList {
    @Prop({
        required: true
    })
    creationDate!: Date

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: "User"
    })
    creatorId!: string

    @Prop({
        required: true
    })
    name!: string

    @Prop({ type: [{ type: String, ref: "User" }] })
    users!: string[]

    @Prop({
        type: [
            {
                bought: { type: Number },
                quantity: { type: Number },
                product: { type: Types.ObjectId, ref: "Product" }
            }
        ]
    })
    products!: { bought: number; quantity: number; product: string }[]
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList)
