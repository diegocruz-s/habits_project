import { ITokenGenerator } from "../controllers/auth/protocols"
import { sign } from 'jsonwebtoken'

export class TokenGeneratorJwt implements ITokenGenerator {
    async generate(id: string): Promise<string> {
        const token = sign({
            id
        }, process.env.SECRET_TOKEN!, {
            expiresIn: '7d'
        })

        return token
    }
}