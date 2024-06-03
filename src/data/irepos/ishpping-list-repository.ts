import { PopulatedShoppingList } from "src/list/dto/populated-shopping-list"
import { ShoppingList, ShoppingListDocument } from "../schemas"

export interface IShoppingListRepository {
    getAllByUserId(userId: string): Promise<ShoppingListDocument[] | null>
    getById(id: string): Promise<ShoppingListDocument | null>
    getPopulatedById(id: string): Promise<PopulatedShoppingList | null>
    create(list: ShoppingList): Promise<ShoppingListDocument | null>
    update(listId: string, newList: ShoppingList): Promise<PopulatedShoppingList | null>
    delete(id: string): Promise<ShoppingListDocument | null>
    addParticipant(listId: string, participantId: string): Promise<ShoppingListDocument | null>
    removeParticipant(listId: string, participantId: string): Promise<ShoppingListDocument | null>
}
