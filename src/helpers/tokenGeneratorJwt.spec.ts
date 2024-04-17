import { config } from 'dotenv'
config()
import { randomUUID } from "crypto"
import { TokenGeneratorJwt } from "./tokenGeneratorJwt"

describe('TokenGeneratorJwt', () => {
    it('should return a token when user id is provided', async () => {
        const tokenGeneratorJwt = new TokenGeneratorJwt()
        const id = randomUUID()

        const token = await tokenGeneratorJwt.generate(id)

        expect(token).toBeTruthy()
    })
})