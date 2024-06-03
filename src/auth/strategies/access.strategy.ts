import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Payload } from "../types"

export const JWTAccess = "JWTAccess"

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, JWTAccess) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_SALT
        })
    }

    validate(payload: Payload): Payload {
        return payload
    }
}
