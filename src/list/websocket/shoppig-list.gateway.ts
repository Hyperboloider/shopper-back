import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    MessageBody,
    SubscribeMessage
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import {
    ClientToServerEvents,
    JoinShoppingList,
    ServerToClientEvents
} from "./interface/shopping-list-websocket.interface"
import { Inject, Injectable } from "@nestjs/common"
import { IUsersService, USERS_SERVICE } from "src/users/users.service-interface"
import { IDataService } from "src/data/data-service/idata-service"

@Injectable()
@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class ShoppingListGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server = new Server<ServerToClientEvents, ClientToServerEvents>()

    constructor(
        @Inject(USERS_SERVICE)
        private userService: IUsersService,
        private dataServices: IDataService
    ) {}

    handleConnection(socket: Socket) {
        console.log("🔴connection", socket.id)
    }

    handleDisconnect(socket: Socket) {
        console.log("🔴disconnect", socket.id)
    }

    @SubscribeMessage("join")
    async handleJoinEvent(
        @MessageBody()
        payload: JoinShoppingList
    ): Promise<boolean> {
        console.log("🔴join", payload)
        this.userService.setSocketId(payload.user.userId, payload.user.socketId)
        const listsByUser = await this.dataServices.shoppingListRepository.getAllByUserId(
            payload.user.userId
        )
        if (listsByUser) {
            listsByUser.forEach((l) => {
                console.log("🟢subscribe", payload.user.socketId, l.id)
                this.server.in(payload.user.socketId).socketsJoin(String(l.id))
            })
        }
        return true
    }

    async joinList(userId: string, listId: string) {
        const user = await this.userService.getUser(userId)
        console.log("🤡", user.socketId)
        if (!user.socketId) {
            return
        }
        this.server.in(user.socketId).socketsJoin(listId)
    }

    notifyInvalidation(senderId: string, shoppingListId: string) {
        console.log("🔵", {
            eventName: "update",
            senderId: senderId,
            shoppingListId: shoppingListId
        })
        this.server.to(shoppingListId).emit("update", {
            eventName: "update",
            senderId: senderId,
            shoppingListId: shoppingListId
        })
    }

    unsubscribeUser(userSocketId: string, listId: string) {
        this.server.in(userSocketId).socketsLeave(listId)
    }
}
