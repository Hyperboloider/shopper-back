/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Payload } from "src/auth/types/payload"

export const UserId = createParamDecorator((_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as Payload
    return user?.sub
})
