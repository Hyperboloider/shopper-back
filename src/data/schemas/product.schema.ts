import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types, Document } from "mongoose"

export type ProductDocument = Product & Document

@Schema()
export class Product {
    @Prop({
        required: true,
        es_type: "completion"
    })
    name!: string

    @Prop({
        required: true
    })
    description!: string

    @Prop({
        required: true,
        index: true,
        unique: true
    })
    upc!: string
    // price here is always per kilo
    @Prop({
        required: true
    })
    price!: number

    @Prop({
        required: true
    })
    isPricePerKilo!: boolean
    // for items which are not sold in individual packages wheight is always 1
    @Prop({
        required: false
    })
    weightPerItem!: number

    @Prop({
        required: false
    })
    caloriesPer100g?: number

    @Prop({
        required: false
    })
    protein?: number

    @Prop({
        required: false
    })
    fat?: number

    @Prop({
        required: false
    })
    carb?: number

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: "Category"
    })
    categoryId!: string

    @Prop()
    imageUrl?: string

    @Prop()
    imageKey?: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)
