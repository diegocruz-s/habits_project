import { CreateUserController } from "./create-user"
import { ICreateUserRepository, IHashPassword } from "./protocols"
import { User } from '../../../entities/user/User'
import { randomUUID } from "crypto"
import { faker } from "@faker-js/faker"

const makeFakeRepository = () => {
    const createUserRepository: ICreateUserRepository = {
        async create(user: User) {
            return user
        },
    }

    return {
        createUserRepository
    }
}

const makeFakeEncrypterPassword = () => {
    const encrypterPwd: IHashPassword = {
        async hash(password: string) {
            return `${password + Date.now().toString()}`
        }
    }

    return {
        encrypterPwd
    }
}

const makeControllerWithMocks = () => {
    const { createUserRepository } = makeFakeRepository()
    const { encrypterPwd } = makeFakeEncrypterPassword()

    const createUserController = new CreateUserController({
        createUserRepository,
        encrypterPwd
    })

    return { 
        createUserController,
        createUserRepository,
        encrypterPwd
    }
}

describe('CreateUser', () => {
    it('should create a user', async () => {
        const { createUserController } = makeControllerWithMocks()

        const httpBody = {
            id: randomUUID(),
            email: faker.internet.email(),
            name: faker.internet.userName(),
            password: faker.internet.password(),
        }
        const { body, statusCode } = await createUserController.handle({
            body: httpBody
        })

        expect(statusCode).toBe(201)
        expect(body.user).toBeTruthy()
        expect(body.user?.id).toBe(httpBody.id)
        expect(body.user?.name).toBe(httpBody.name)
        expect(body.user?.email).toBe(httpBody.email)
        expect(body.user?.password).not.toBe(httpBody.password)
        expect(body.errors).toBeNull()
    })

    it('should return a error when body is not provided', async () => {
        const { createUserController } = makeControllerWithMocks()

        const { body, statusCode } = await createUserController.handle({})

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.user).toBeNull()
    })

    it('should return a error when email is not valid', async () => {
        const { createUserController } = makeControllerWithMocks()

        const httpBody = {
            id: randomUUID(),
            email: 'any_email',
            name: faker.internet.userName(),
            password: faker.internet.password(),
        }
        const { body, statusCode } = await createUserController.handle({
            body: httpBody
        })

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('email')
        expect(body.user).toBeNull()

    })

    it('should return a error when password less than 6', async () => {
        const { createUserController } = makeControllerWithMocks()

        const httpBody = {
            id: randomUUID(),
            email: faker.internet.email(),
            name: faker.internet.userName(),
            password: '123',
        }
        const { body, statusCode } = await createUserController.handle({
            body: httpBody
        })

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('password')
        expect(body.user).toBeNull()

    })

    it('should return a error when datas is empty', async () => {
        const { createUserController } = makeControllerWithMocks()

        const httpBody = {
            id: randomUUID(),
            email: '',
            name: '',
            password: '',
        }
        const { body, statusCode } = await createUserController.handle({
            body: httpBody
        })

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(3)
        expect(body.user).toBeNull()

    })
})

