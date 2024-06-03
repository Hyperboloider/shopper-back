import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { RefreshPayload } from "../types"

export const JWTRefresh = "JWTRefresh"

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "JWTRefresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.REFRESH_SALT,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: RefreshPayload): RefreshPayload {
        const auth = req.get("Authorization")
        if (!auth) {
            throw new UnauthorizedException("Request not authorized")
        }

        const token = auth.replace("Bearer ", "")
        if (token.length == 0) {
            throw new UnauthorizedException("No access token provided")
        }

        return {
            ...payload,
            token
        }
    }
}
