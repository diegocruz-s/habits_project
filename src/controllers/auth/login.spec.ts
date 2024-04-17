import { randomUUID } from "crypto"

import { CreateUserValid } from "../../../tests/factories/User"
import { ICheckPasswordHash, IDatasLogin } from '../../controllers/auth/protocols'
import { LoginController } from "./login"
import { ILoginRepository, ITokenGenerator } from "./protocols"

const makeFakeRepositoryLogin = () => {
    const loginRepository: ILoginRepository = {
        async login(datas: IDatasLogin) {
            const user = await CreateUserValid({
                email: datas.email, password: datas.password
            })

            return user
        }
    }

    return {
        loginRepository
    }
}

const makeFakeTokenGenerator = () => {
    const tokenGenerator: ITokenGenerator = {
        async generate(id: string) {
            const token = `${Date.now()}'-'${randomUUID()}'-'${id}`
            return token
        },
    }

    return {
        tokenGenerator
    }
}

const makeFakeCheckPasswordHash = () => {
    const checkPasswordHash: ICheckPasswordHash = {
        async compare(password, hash) {
            if (password && hash) return true
            
            return false
        }
    }

    return {
        checkPasswordHash
    }
}

const makeFakeCheckPasswordHashFailed = () => {
    const checkPasswordHashFailed: ICheckPasswordHash = {
        async compare(password, hash) {            
            return false
        }
    }

    return {
        checkPasswordHashFailed
    }
}

const makeLoginController = () => {
    const { loginRepository } = makeFakeRepositoryLogin()
    const { tokenGenerator } = makeFakeTokenGenerator()
    const { checkPasswordHash } = makeFakeCheckPasswordHash()

    const loginController = new LoginController(loginRepository, tokenGenerator, checkPasswordHash)

    return {
        loginController
    }

}

const makeLoginControllerWithComparePwdFailed = () => {
    const { loginRepository } = makeFakeRepositoryLogin()
    const { tokenGenerator } = makeFakeTokenGenerator()
    const { checkPasswordHashFailed } = makeFakeCheckPasswordHashFailed()

    const loginController = new LoginController(loginRepository, tokenGenerator, checkPasswordHashFailed)

    return {
        loginController
    }

}

describe('Login', () => {
    it('should login user', async () => {
        const { loginController } = makeLoginController()

        const datas = {
            email: 'diego@gmail.com',
            password: 'any_pass'
        }

        const response = await loginController.handle({
            body: datas
        })

        expect(response.statusCode).toBe(200)
        expect(response.body).toBeTruthy()
        expect(response.body.errors).toBeNull()
        expect(response.body.user?.id).toBeTruthy()
        expect(response.body.user?.email).toBe(datas.email)
        expect(response.body.user).not.toHaveProperty('password')
        expect(response.body.token).toBeTruthy()
        expect(response.body.token.length).toBeGreaterThan(1)
    })

    it('should return a error when datas is not provided', async () => {
        const { loginController } = makeLoginController()

        const response = await loginController.handle({})

        expect(response.statusCode).toBe(400)
        expect(response.body.user).toBeNull()
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors?.length).toBe(1)
        expect(response.body.token.length).toBeFalsy()
    })

    it('should return a error when email is not valid', async () => {
        const { loginController } = makeLoginController()

        const response = await loginController.handle({
            body: {
                email: 'any_email',
                password: 'any_pass'
            }
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.user).toBeNull()
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors?.length).toBe(1)
        expect(response.body.errors![0]).toContain('email')
        expect(response.body.token.length).toBeFalsy()
    })

    it('should return a error when compare password return false', async () => {
        const { loginController } = makeLoginControllerWithComparePwdFailed()

        const response = await loginController.handle({
            body: {
                email: 'diego@gmail.com',
                password: 'any_pass',
            }
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.user).toBeNull()
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors?.length).toBe(1)
        expect(response.body.errors![0]).toContain('Authentication')
        expect(response.body.token.length).toBeFalsy()
    })
})
