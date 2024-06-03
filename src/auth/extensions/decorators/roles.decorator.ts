import { SetMetadata } from "@nestjs/common"
import { Role } from "src/auth/enum"

export const SetRoles = (...roles: Role[]) => SetMetadata("roles", roles)
