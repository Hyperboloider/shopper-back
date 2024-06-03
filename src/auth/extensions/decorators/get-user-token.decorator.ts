/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { RefreshPayload } from "src/auth/types"

export const UserToken = createParamDecorator((_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as RefreshPayload
    return user?.token
})
