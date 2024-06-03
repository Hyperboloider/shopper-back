import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common"
import { IShoppingListService } from "./ishpping-list.service"
import { IDataService } from "src/data/data-service/idata-service"
import { ShoppingList, ShoppingListDocument } from "src/data/schemas/shopping-list.schema"
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto"
import {
    PopulatedShoppingListReponseDto,
    ShoppingListReponseDto
} from "./dto/response-shopping-list.dto"
import { InvitationResponseDto } from "./dto/response-invitation.dto"
import { ShoppingListGateway } from "./websocket/shoppig-list.gateway"
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto"
import { ListFulfillmentDto } from "./dto/fulfil-shopping-list.dto"

@Injectable()
export class ShoppingListService implements IShoppingListService {
    constructor(private dataServices: IDataService, private gateway: ShoppingListGateway) {}

    async getById(requesterId: string, id: string): Promise<PopulatedShoppingListReponseDto> {
        const list = await this.dataServices.shoppingListRepository.getPopulatedById(id)
        if (!list) {
            throw new NotFoundException()
        }
        if (!list.users.includes(requesterId)) {
            throw new ForbiddenException()
        }
        return new PopulatedShoppingListReponseDto(list)
    }

    async getAll(requesterId: string): Promise<ShoppingListReponseDto[]> {
        const lists = await this.dataServices.shoppingListRepository.getAllByUserId(requesterId)
        if (!lists) {
            throw new NotFoundException()
        }
        console.log(lists.map((l) => new ShoppingListReponseDto(l)))
        return lists.map((l) => new ShoppingListReponseDto(l))
    }

    async createShoppingList(
        creatorId: string,
        createShoppingListDto: CreateShoppingListDto
    ): Promise<ShoppingListReponseDto> {
        const newShoppingList: ShoppingList = {
            ...createShoppingListDto,
            creatorId: creatorId,
            creationDate: new Date(),
            users: [creatorId],
            products: createShoppingListDto.products.map((p) => {
                return {
                    bought: 0,
                    ...p
                }
            })
        }

        const created = await this.dataServices.shoppingListRepository.create(newShoppingList)
        if (!created) {
            throw new InternalServerErrorException()
        }

        await this.gateway.joinList(creatorId, String(created.id))
        return new ShoppingListReponseDto(created)
    }

    async updateShoppingList(
        requesterId: string,
        listId: string,
        updateDto: UpdateShoppingListDto
    ): Promise<PopulatedShoppingListReponseDto> {
        const existing = await this.dataServices.shoppingListRepository.getById(listId)
        if (!existing) {
            throw new NotFoundException()
        }
        if (existing.creatorId != requesterId) {
            throw new ForbiddenException()
        }

        const updated = {
            ...existing.toObject(),
            products: [] as typeof existing.products
        }

        if (updateDto.products) {
            updated.products = updateDto.products.map((product) => ({
                product: product.product,
                quantity: product.quantity,
                bought:
                    existing.products.find(
                        (p) => p.product.toString() == product.product.toString()
                    )?.bought ?? 0
            }))
        }

        const updatedDocument = await this.dataServices.shoppingListRepository.update(
            listId,
            updated as unknown as ShoppingList
        )
        if (!updatedDocument) {
            throw new InternalServerErrorException()
        }

        this.gateway.notifyInvalidation(requesterId, listId)
        return new PopulatedShoppingListReponseDto(updatedDocument)
    }

    async deleteShoppingList(requesterId: string, id: string) {
        const list = await this.dataServices.shoppingListRepository.getById(id)
        if (!list) {
            throw new NotFoundException()
        }
        if (list.creatorId != requesterId) {
            return await this.kickUserAndNotify(requesterId, requesterId, list)
        }
        const deleted = await this.dataServices.shoppingListRepository.delete(id)

        if (!deleted) {
            throw new InternalServerErrorException()
        }

        this.gateway.notifyInvalidation(requesterId, id)
    }

    async kickUser(listId: string, requesterId: string, kickedId: string): Promise<void> {
        const list = await this.dataServices.shoppingListRepository.getById(listId)
        if (!list) {
            throw new NotFoundException()
        }
        if (list.creatorId != requesterId) {
            throw new ForbiddenException()
        }
        console.log("🍑", requesterId, kickedId)
        return this.kickUserAndNotify(requesterId, kickedId, list)
    }

    async kickUserAndNotify(
        requesterId: string,
        kickedId: string,
        listDocument: ShoppingListDocument
    ) {
        const newDocument: ShoppingList = {
            ...listDocument.toObject(),
            users: listDocument.users.filter((u) => u !== kickedId)
        }
        console.log("🤡", newDocument, listDocument.users, kickedId, requesterId)

        const id = String(listDocument.id)
        await this.dataServices.shoppingListRepository.update(id, newDocument)
        this.gateway.notifyInvalidation(requesterId, id)
    }

    async generateInvitation(requesterId: string, listId: string): Promise<InvitationResponseDto> {
        const shoppingList = await this.dataServices.shoppingListRepository.getById(listId)
        if (!shoppingList) {
            throw new NotFoundException("Shopping list does not exist")
        }

        if (shoppingList.creatorId != requesterId) {
            throw new ForbiddenException()
        }

        const invitation = await this.dataServices.invitationRepository.create(listId)
        if (!invitation) {
            throw new InternalServerErrorException()
        }
        return new InvitationResponseDto(invitation)
    }

    async acceptInvitation(
        requesterId: string,
        invitationId: string
    ): Promise<ShoppingListReponseDto> {
        const invitation = await this.dataServices.invitationRepository.getById(invitationId)
        if (!invitation) {
            throw new NotFoundException("Invitation does not exist")
        }

        const shoppingList = await this.dataServices.shoppingListRepository.getById(
            invitation.shoppingListId
        )
        if (!shoppingList) {
            throw new NotFoundException("Shopping list does not exist")
        }

        if (shoppingList.creatorId == requesterId) {
            throw new BadRequestException("You can't accept own invitation")
        }

        const participantAdditionResult =
            await this.dataServices.shoppingListRepository.addParticipant(
                invitation.shoppingListId,
                requesterId
            )

        if (!participantAdditionResult) {
            throw new InternalServerErrorException()
        }

        await this.dataServices.invitationRepository.remove(invitationId)

        this.gateway.notifyInvalidation(requesterId, invitation.shoppingListId)
        await this.gateway.joinList(requesterId, invitation.shoppingListId)
        return new ShoppingListReponseDto(participantAdditionResult)
    }

    async fulfilShoppingLists(requesterId: string, dto: ListFulfillmentDto): Promise<void> {
        for (const listId of dto.listsIds) {
            const shoppingList = await this.dataServices.shoppingListRepository.getById(listId)
            console.log("🤓", shoppingList)
            if (!(shoppingList && shoppingList.users.includes(requesterId))) {
                return
            }
            dto.products.forEach((dtoProduct) => {
                const listProduct = shoppingList.products.find(
                    (p) => p.product.toString() == dtoProduct.product.toString()
                )
                if (listProduct) {
                    const quantityToAdd = Math.min(
                        dtoProduct.quantity,
                        listProduct.quantity - listProduct.bought
                    )
                    listProduct.bought += quantityToAdd
                    dtoProduct.quantity -= quantityToAdd
                }
            })
            console.log("🤡", dto.products, shoppingList.products)

            await this.dataServices.shoppingListRepository.update(
                String(shoppingList.id),
                shoppingList
            )

            this.gateway.notifyInvalidation(requesterId, listId)
        }
    }
}
