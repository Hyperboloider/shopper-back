import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    UnprocessableEntityException
} from "@nestjs/common"
import { Response } from "express"
import { ErrorResponse } from "./error.response"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse<Response>()
        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = "Internal server error"

        let errorResponse: ErrorResponse = {
            statusCode: status,
            error: (exception as object)?.constructor.name ?? "",
            message: message
        }

        if (exception instanceof HttpException) {
            status = exception.getStatus()
            message = exception.message

            const errResp = exception.getResponse() as ErrorResponse

            if (errResp) {
                errorResponse = errResp
            }
        } else {
            console.log(exception)
        }

        if (this.hasCode(exception)) {
            switch (exception.code) {
                case 11000:
                    status = HttpStatus.UNPROCESSABLE_ENTITY
                    const exception = new UnprocessableEntityException("Conflicting entity!")
                    errorResponse = exception.getResponse() as ErrorResponse
            }
        }

        response.status(status).json(errorResponse)
    }

    private hasCode(obj: unknown): obj is ICode {
        return (obj as ICode)?.code !== undefined && typeof (obj as ICode).code === "number"
    }
}
