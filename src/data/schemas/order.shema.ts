import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types, Document } from "mongoose"

export type OrderDocument = Order & Document

@Schema()
export class Order {
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
        type: [{ quantity: { type: Number }, product: { type: Types.ObjectId, ref: "Product" } }]
    })
    products!: { quantity: number; product: string }[]
}

export const OrderSchema = SchemaFactory.createForClass(Order)
