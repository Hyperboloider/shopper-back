import { InvitationDocument } from "../schemas/invitation.schema"

export interface IInvitationRepository {
    getById(id: string): Promise<InvitationDocument | null>
    create(shoppingListId: string): Promise<InvitationDocument | null>
    remove(id: string): Promise<InvitationDocument | null>
}
