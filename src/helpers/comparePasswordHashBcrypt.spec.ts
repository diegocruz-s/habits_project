import { ComparePasswordHashBcrpyt } from "./comparePasswordHashBcrypt"
import { HashPasswordBcrypt } from "./hashBcrypt"
import { createHash } from "crypto"

describe('CheckPasswordHashBcrypt', () => {
    it('should return true when password match hash', async () => {
        const password = 'Teste@123'
        const hash = await new HashPasswordBcrypt().hash(password)

        const comparePasswordHashBcrypt = new ComparePasswordHashBcrpyt()

        const resultCheck = await comparePasswordHashBcrypt.compare(password, hash)

        expect(resultCheck).toBe(true)

    })

    it('should return false when password not match hash', async () => {
        const password = 'Teste@123'
        const hash = createHash('sha256').update('any_string').digest('hex')

        const comparePasswordHashBcrypt = new ComparePasswordHashBcrpyt()

        const resultCheck = await comparePasswordHashBcrypt.compare(password, hash)

        expect(resultCheck).toBe(false)

    })
})