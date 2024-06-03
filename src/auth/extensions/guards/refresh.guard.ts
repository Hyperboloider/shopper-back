import { AuthGuard } from "@nestjs/passport"
import { JWTRefresh } from "src/auth/strategies"

export class RefreshGuard extends AuthGuard(JWTRefresh) {}
