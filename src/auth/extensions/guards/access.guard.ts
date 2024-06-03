import { AuthGuard } from "@nestjs/passport"
import { JWTAccess } from "src/auth/strategies"

export class AccessGuard extends AuthGuard(JWTAccess) {}
