import { InvitationDocument } from "../schemas/invitation.schema"
import { IInvitationRepository } from "../irepos"
import { Model } from "mongoose"

export class InvitationRepository implements IInvitationRepository {
    constructor(private _repository: Model<InvitationDocument>) {}

    getById(id: string): Promise<InvitationDocument | null> {
        return this._repository.findById(id).exec()
    }

    create(shoppingListId: string): Promise<InvitationDocument | null> {
        return this._repository.create({ shoppingListId })
    }
    remove(id: string): Promise<InvitationDocument | null> {
        return this._repository.findByIdAndDelete(id).exec()
    }
}
