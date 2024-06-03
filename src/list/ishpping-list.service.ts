import {
    PopulatedShoppingListReponseDto,
    ShoppingListReponseDto
} from "./dto/response-shopping-list.dto"
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto"
import { InvitationResponseDto } from "./dto/response-invitation.dto"
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto"
import { ListFulfillmentDto } from "./dto/fulfil-shopping-list.dto"

export const SHOPPING_LIST_SERVICE = "SHOPPING_LIST_SERVICE"

export interface IShoppingListService {
    getById(requesterId: string, id: string): Promise<PopulatedShoppingListReponseDto>

    getAll(requesterId: string): Promise<ShoppingListReponseDto[]>

    createShoppingList(
        creatorId: string,
        createShoppingListDto: CreateShoppingListDto
    ): Promise<ShoppingListReponseDto>

    updateShoppingList(
        requesterId: string,
        listId: string,
        updateDto: UpdateShoppingListDto
    ): Promise<PopulatedShoppingListReponseDto>

    deleteShoppingList(requesterId: string, id: string): Promise<void>

    kickUser(listId: string, requesterId: string, kickedId: string): Promise<void>

    generateInvitation(requesterId: string, listId: string): Promise<InvitationResponseDto>

    acceptInvitation(requesterId: string, invitationId: string): Promise<ShoppingListReponseDto>

    fulfilShoppingLists(requesterId: string, dto: ListFulfillmentDto): Promise<void>
}
