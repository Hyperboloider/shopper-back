/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Role } from "src/auth/enum"

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest()
        const roles = this.reflector.get<Role[]>("roles", context.getHandler()) ?? [Role.User]
        const userRoles: Role[] = req?.user?.roles ?? []
        return userRoles.some((r) => roles.includes(r))
    }
}
