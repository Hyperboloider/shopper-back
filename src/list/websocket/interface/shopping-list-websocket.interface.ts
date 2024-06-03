import { z } from "zod"
import {
    UserIdSchema,
    UserNameSchema,
    SocketIdSchema,
    UserSchema,
    UpdateListSchema,
    ServerToClientEventsSchema,
    ClientToServerEventsSchema,
    JoinShoppingListSchema
} from "./shopping-list-websocket.schema"

export type UserId = z.infer<typeof UserIdSchema>
export type UserName = z.infer<typeof UserNameSchema>
export type SocketId = z.infer<typeof SocketIdSchema>
export type User = z.infer<typeof UserSchema>

export type UpdateList = z.infer<typeof UpdateListSchema>
export type JoinShoppingList = z.infer<typeof JoinShoppingListSchema>

export type ClientToServerEvents = z.infer<typeof ClientToServerEventsSchema>
export type ServerToClientEvents = z.infer<typeof ServerToClientEventsSchema>
