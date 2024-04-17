import { CreateUserValid } from "../../../../tests/factories/User"
import { User } from "../../../entities/user/User"
import { FindUserController } from "./find-user"
import { IFindUserRepository } from "./protocols"

const datasFirstUserExample = CreateUserValid({})

const makeFakeRepository = () => {

    class FindUserRepository implements IFindUserRepository {
        private users: User[] = [ datasFirstUserExample ]

        async findUser(id: string) {
            const user = this.users.find(user => user.id === id)

            if(!user) throw new Error('User not found!')

            const { password, ...rest } = user
            
            return rest as Omit<User, 'password'>

        }
    }

    const findUserRepository = new FindUserRepository()

    return {
        findUserRepository
    }
}

const makeControllerWithMocks = () => {
    const { findUserRepository } = makeFakeRepository()

    const findUserController = new FindUserController(findUserRepository)

    return {
        findUserController
    }
}

describe('Find User' , () => {
    it('should return a user', async () => {
        const { findUserController } = makeControllerWithMocks()
    
        const { body, statusCode } = await findUserController.handle({
            params: {
                userId: datasFirstUserExample.id
            }
        })
    
        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.user).toBeTruthy()
        expect(body.user?.id).toBe(datasFirstUserExample.id)
        expect(body.user?.email).toBe(datasFirstUserExample.email)
        expect(body.user?.name).toBe(datasFirstUserExample.name)
        expect(body.user?.isActive).toBe(true)
        expect(body.user).not.toHaveProperty('password')

    })

    it('should return a erro when `userId` is not provided', async () => {
        const { findUserController } = makeControllerWithMocks()
    
        const { body, statusCode } = await findUserController.handle({
            params: {}
        })
    
        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Params is not corrected, userId is missing!')
        expect(body.user).toBeNull()

    })

    it('should return a error when params is not provided', async () => {
        const { findUserController } = makeControllerWithMocks()
        
        const { body, statusCode } = await findUserController.handle({})

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Params is not corrected, userId is missing!')
        expect(body.user).toBeNull()

    })
})
