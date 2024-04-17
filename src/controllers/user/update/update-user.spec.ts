import { randomUUID } from "crypto"

import { CreateUserValid } from "../../../../tests/factories/User"
import { User } from "../../../entities/user/User"
import { IHashPassword } from "../create/protocols"
import { IDatasUpdate, IUpdateUserRepository } from "./protocols"
import { UpdateUserController } from "./update-user"

const datasFirstUserExample = CreateUserValid({})

const makeFakeRepository = () => {

    class UpdateUserRepository implements IUpdateUserRepository {
        private users: User[] = [
            datasFirstUserExample
        ]
        
        async update(id: string, datas: IDatasUpdate): Promise<Omit<User, 'password'>> {
            this.users = this.users.map(user => {
                if(user.id === id) {
                    return { ...user, ...datas } as User
                }
                return user
            })
            const userReturn = await this.findById(id)
            const { password, ...rest } = userReturn

            return rest as Omit<User, 'password'>
        }

        async findById(userId: string): Promise<User> { 
            const foundUser = this.users.find(user => user.id === userId) 

            if(!foundUser) throw new Error('User not found!')
            
            return foundUser
        }
    }

    const updateUserRepository = new UpdateUserRepository()

    return {
        updateUserRepository
    }
}

const makeFakeHashEncrypted = () => {
    const encrypterPwd: IHashPassword = {
        async hash(password) {
            return `${password + Date.now() + randomUUID()}`
        },
    }

    return {
        encrypterPwd
    }
}

const makeUptadeUserController = () => {
    const { updateUserRepository } = makeFakeRepository()
    const { encrypterPwd } = makeFakeHashEncrypted()

    const updateUserController = new UpdateUserController(updateUserRepository, encrypterPwd)

    return {
        updateUserRepository,
        encrypterPwd,
        updateUserController,
    }

}

describe('Update User', () => {
    it('should update a user', async () => {
        const { updateUserController } = makeUptadeUserController()
        const datasUpdate = {
            name: 'New name',
            email: 'newEmail@gmail.com',
            password: 'NewPwd@123',
        }

        const { body, statusCode } = await updateUserController.handle({
            body: datasUpdate,
            params: {
                userId: datasFirstUserExample.id
            }
        })        

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('User updated with successfully!')
        expect(body.user?.id).toBe(datasFirstUserExample.id)
        expect(body.user?.name).toBe(datasUpdate.name)
        expect(body.user?.email).toBe(datasUpdate.email)
        expect(body.user).not.toHaveProperty('password')
    })

    it('should translate only one field [name]', async () => {
        const { updateUserController } = makeUptadeUserController()
        const datasUpdate = {
            name: 'New name',
        }

        const { body, statusCode } = await updateUserController.handle({
            body: datasUpdate,
            params: {
                userId: datasFirstUserExample.id
            }
        })        

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('User updated with successfully!')
        expect(body.user?.id).toBe(datasFirstUserExample.id)
        expect(body.user?.name).toBe(datasUpdate.name)
        expect(body.user?.email).toBe(datasFirstUserExample.email)
        expect(body.user).not.toHaveProperty('password')
    })

    it('should translate only one field [email]', async () => {
        const { updateUserController } = makeUptadeUserController()
        const datasUpdate = {
            email: 'newEmail@gmail.com',
        }

        const { body, statusCode } = await updateUserController.handle({
            body: datasUpdate,
            params: {
                userId: datasFirstUserExample.id
            }
        })        

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('User updated with successfully!')
        expect(body.user?.id).toBe(datasFirstUserExample.id)
        expect(body.user?.name).toBe(datasFirstUserExample.name)
        expect(body.user?.email).toBe(datasUpdate.email)
        expect(body.user).not.toHaveProperty('password')
    })

    it('should translate only one field [password]', async () => {
        const { updateUserController } = makeUptadeUserController()
        const datasUpdate = {
            password: 'NewPwd@123',
        }

        const { body, statusCode } = await updateUserController.handle({
            body: datasUpdate,
            params: {
                userId: datasFirstUserExample.id
            }
        })        

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('User updated with successfully!')
        expect(body.user?.id).toBe(datasFirstUserExample.id)
        expect(body.user?.name).toBe(datasFirstUserExample.name)
        expect(body.user?.email).toBe(datasFirstUserExample.email)
        expect(body.user).not.toHaveProperty('password')
    })

    it('should return an error when other data is sent', async () => {
        const { updateUserController } = makeUptadeUserController()
        const datasUpdate = {
            name: 'New name',
            email: 'newEmail@gmail.com',
            password: 'NewPwd@123',
            any_field: 'any_field'
        }

        const { body, statusCode } = await updateUserController.handle({
            body: datasUpdate,
            params: {
                userId: datasFirstUserExample.id
            }
        })

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Invalid datas!')
        expect(body.success).toBeFalsy()
        expect(body.user).toBeNull()
    })

    it('should return an error when datas is not sent', async () => {
        const { updateUserController } = makeUptadeUserController()
        const datasUpdate = {}

        const { body, statusCode } = await updateUserController.handle({
            body: datasUpdate,
            params: {
                userId: datasFirstUserExample.id
            }
        })

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('No datas sent!')
        expect(body.success).toBeFalsy()
        expect(body.user).toBeNull()
    })

    it('should return an error when userId is not provided', async () => {
        const { updateUserController } = makeUptadeUserController()
        const datasUpdate = {
            name: 'New name',
            email: 'newEmail@gmail.com',
            password: 'NewPwd@123',
            any_field: 'any_field'
        }

        const { body, statusCode } = await updateUserController.handle({
            body: datasUpdate,
        })

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Params is not corrected, userId is missing!')
        expect(body.success).toBeFalsy()
        expect(body.user).toBeNull()
    })
})