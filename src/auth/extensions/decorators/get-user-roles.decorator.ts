/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Role } from "src/auth/enum"
import { Payload } from "src/auth/types/payload"

export const UserRoles = createParamDecorator((_: undefined, context: ExecutionContext): Role[] => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as Payload
    return user?.roles
})
