import { HashPasswordBcrypt } from "./hashBcrypt"

describe('Hash Bcrypt', () => {
    it('should return a hash when password is provided', async () => {
        const hashPasswordBcrypt = new HashPasswordBcrypt()
        const pwd = 'any_pass'

        const newPwd = await hashPasswordBcrypt.hash(pwd)

        expect(newPwd).toBeTruthy()
        expect(newPwd).not.toBe(pwd)

    })
})