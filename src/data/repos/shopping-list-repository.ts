import { Model } from "mongoose"
import { IShoppingListRepository } from "../irepos/ishpping-list-repository"
import { ShoppingList, ShoppingListDocument } from "../schemas"
import { PopulatedShoppingList } from "src/list/dto/populated-shopping-list"

export class ShoppingListRepository implements IShoppingListRepository {
    constructor(private _repository: Model<ShoppingListDocument>) {}

    getAllByUserId(userId: string): Promise<ShoppingListDocument[] | null> {
        return this._repository.find({ users: userId }).exec()
    }

    getById(id: string): Promise<ShoppingListDocument | null> {
        return this._repository.findById(id).exec()
    }

    async getPopulatedById(id: string): Promise<PopulatedShoppingList | null> {
        return (await this._repository
            .findById(id)
            .populate("products.product")
            .exec()) as unknown as PopulatedShoppingList
    }

    create(list: ShoppingList): Promise<ShoppingListDocument | null> {
        return this._repository.create(list)
    }

    async update(listId: string, newList: ShoppingList): Promise<PopulatedShoppingList | null> {
        return (await this._repository
            .findByIdAndUpdate(listId, newList, {
                new: true,
                overwrite: true,
                runValidators: true
            })
            .populate("products.product")
            .exec()) as unknown as PopulatedShoppingList
    }

    delete(id: string): Promise<ShoppingListDocument | null> {
        return this._repository.findByIdAndDelete(id).exec()
    }

    addParticipant(listId: string, participantId: string): Promise<ShoppingListDocument | null> {
        return this._repository
            .findByIdAndUpdate(listId, { $addToSet: { users: participantId } }, { new: true })
            .exec()
    }

    removeParticipant(listId: string, participantId: string): Promise<ShoppingListDocument | null> {
        return this._repository
            .findByIdAndUpdate(listId, { $pull: { users: participantId } }, { new: true })
            .exec()
    }
}
