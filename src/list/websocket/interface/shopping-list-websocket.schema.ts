// const ShoppingListItemSchema = z.object({
//     quantity: z
//         .number()
//         .min(1, { message: "Quantity must be at least 1" })
//         .max(30, { message: "Quantity must not exceed 30" }),
//     product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")
// })

// export const ShoppingListUpdateSchema = z.array(ShoppingListItemSchema)

// export const ShoppingListFulfilledSchema = z.array(ShoppingListItemSchema)

// export const EventNameSchema = z.enum(["update"]) // , "fulfill", "kick", "join"

// export const ShoppingListNameSchema = z
//     .string()
//     .min(1, { message: "Must be at least 1 characters." })

// export const FulfillListSchema = z.object({
//     user: UserSchema,
//     shoppingListName: ShoppingListNameSchema,
//     eventName: EventNameSchema,
//     acquiredItems: ShoppingListFulfilledSchema
// })

// export const JoinShoppingListSchema = z.object({
//     user: UserSchema,
//     shoppingListName: ShoppingListNameSchema,
//     eventName: EventNameSchema
// })

// export const KickUserSchema = z.object({
//     user: UserSchema,
//     userToKick: UserSchema,
//     shoppingListName: ShoppingListNameSchema,
//     eventName: EventNameSchema
// })

// export const ClientToServerEventsSchema = z.object({
//     update: z.function().args(UpdateListSchema, AcknowledgenmentSchema).returns(z.void()),
//     fulfill: z.function().args(FulfillListSchema, AcknowledgenmentSchema).returns(z.void()),
//     join: z.function().args(JoinShoppingListSchema, AcknowledgenmentSchema).returns(z.void()),
//     kick: z.function().args(KickUserSchema, AcknowledgenmentSchema).returns(z.void())
// })

import { z } from "zod"

export const UserIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")

export const UserNameSchema = z.string().min(1, { message: "Must be at least 1 character." })

export const EventNameSchema = z.enum(["update"])

export const SocketIdSchema = z.string()

export const UserSchema = z.object({
    userId: UserIdSchema,
    userName: UserNameSchema,
    socketId: SocketIdSchema
})

export const UpdateListSchema = z.object({
    user: UserSchema,
    shoppingListId: z.string(),
    eventName: EventNameSchema
})

export const JoinShoppingListSchema = z.object({
    user: UserSchema,
    eventName: EventNameSchema
})

export const AcknowledgenmentSchema = z.function().args(z.boolean()).returns(z.void())

export const ClientToServerEventsSchema = z.object({
    join: z.function().args(JoinShoppingListSchema, AcknowledgenmentSchema).returns(z.void())
})

export const ServerToClientEventsSchema = z.object({
    update: z.function().args(UpdateListSchema, AcknowledgenmentSchema).returns(z.void())
})
