import { InvitationDocument } from "src/data/schemas/invitation.schema"

export class InvitationResponseDto {
    constructor(invitation: InvitationDocument) {
        this.id = String(invitation.id)
        this.shoppingListId = invitation.shoppingListId
    }
    id: string
    shoppingListId: string
}
