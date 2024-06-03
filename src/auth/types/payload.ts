import { Role } from "../enum"

export type Payload = {
    sub: string
    email: string
    roles: Role[]
}
