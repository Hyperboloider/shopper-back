import { UserDocument } from "src/data/schemas"

export class CompactUserResponse {
    constructor(doc: UserDocument) {
        this.id = String(doc.id)
        this.fullName = `${doc.firstName} ${doc.lastName}`
    }

    id: string
    fullName: string
}
