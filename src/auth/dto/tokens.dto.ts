export class Tokens {
    constructor(refreshToken: string, accessToken: string) {
        this.refreshToken = refreshToken
        this.accessToken = accessToken
    }

    refreshToken: string
    accessToken: string
}
