import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { UserId } from "src/auth/extensions/decorators"
import { AccessGuard } from "src/auth/extensions/guards"
import { IShoppingListService, SHOPPING_LIST_SERVICE } from "./ishpping-list.service"
import { Invitation } from "src/data/schemas/invitation.schema"
import {
    PopulatedShoppingListReponseDto,
    ShoppingListReponseDto
} from "./dto/response-shopping-list.dto"
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto"
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto"
import { ListFulfillmentDto } from "./dto/fulfil-shopping-list.dto"

@Controller("shopping-lists")
@ApiBearerAuth("access")
@UseGuards(AccessGuard)
export class ShoppingListController {
    constructor(
        @Inject(SHOPPING_LIST_SERVICE)
        private shoppingListService: IShoppingListService
    ) {}

    @Get()
    async getAll(@UserId() userId: string): Promise<ShoppingListReponseDto[]> {
        return await this.shoppingListService.getAll(userId)
    }

    @Get(":listId")
    async getByUd(
        @UserId() userId: string,
        @Param("listId") listId: string
    ): Promise<PopulatedShoppingListReponseDto> {
        return await this.shoppingListService.getById(userId, listId)
    }

    @Post()
    async createShoppingList(
        @UserId() userId: string,
        @Body() createDto: CreateShoppingListDto
    ): Promise<ShoppingListReponseDto> {
        return await this.shoppingListService.createShoppingList(userId, createDto)
    }

    @Put(":listId")
    async updateShoppingList(
        @UserId() userId: string,
        @Param("listId") listId: string,
        @Body() updateDto: UpdateShoppingListDto
    ): Promise<PopulatedShoppingListReponseDto> {
        return await this.shoppingListService.updateShoppingList(userId, listId, updateDto)
    }

    @Delete(":id")
    async deleteShoppingList(@UserId() userId: string, @Param("id") listId: string): Promise<void> {
        return await this.shoppingListService.deleteShoppingList(userId, listId)
    }

    @Post(":listId/invite")
    async generateInvitation(
        @UserId() userId: string,
        @Param("listId") listId: string
    ): Promise<Invitation> {
        return await this.shoppingListService.generateInvitation(userId, listId)
    }

    @Post("invitations/:invitationId")
    async acceptInvitation(
        @UserId() userId: string,
        @Param("invitationId") invitationId: string
    ): Promise<ShoppingListReponseDto> {
        return await this.shoppingListService.acceptInvitation(userId, invitationId)
    }

    @Post("fulfill")
    async fulfillLists(@UserId() userId: string, @Body() fulfilmentDto: ListFulfillmentDto) {
        await this.shoppingListService.fulfilShoppingLists(userId, fulfilmentDto)
    }

    @Patch(":listId/kick/:id")
    async kickUser(
        @UserId() requesterId: string,
        @Param("listId") listId: string,
        @Param("id") kickedUserId: string
    ) {
        console.log("🤓", requesterId, kickedUserId)
        return this.shoppingListService.kickUser(listId, requesterId, kickedUserId)
    }
}
