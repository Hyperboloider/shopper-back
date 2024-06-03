import { ShoppingListDocument } from "src/data/schemas"
import { PopulatedShoppingList } from "./populated-shopping-list"
import { ResponseProductDto } from "src/products/dto"

export class ShoppingListReponseDto {
    constructor(list: ShoppingListDocument) {
        this.id = String(list.id)
        this.name = list.name
        this.creationDate = list.creationDate
        this.creatorId = list.creatorId
        this.users = list.users
        this.products = list.products
    }

    id: string
    name: string
    creationDate: Date
    creatorId: string
    users: string[]
    products: { quantity: number; product: string; bought: number }[]
}

export class PopulatedShoppingListReponseDto {
    constructor(list: PopulatedShoppingList) {
        this.id = String(list._id)
        this.name = list.name
        this.creationDate = list.creationDate
        this.creatorId = list.creatorId
        this.users = list.users
        this.products = list.products.map((p) => {
            return {
                quantity: p.quantity,
                product: ResponseProductDto.parseFromDocument(p.product),
                bought: p.bought
            }
        })
    }

    id: string
    name: string
    creationDate: Date
    creatorId: string
    users: string[]
    products: { quantity: number; product: ResponseProductDto; bought: number }[]
}
