import { CreateUserValid } from "../../../../tests/factories/User"
import { DeleteUserController } from "./delete-user"
import { IDeleteUserRepository } from "./protocols"

const makeFakeRepository = () => {
    const deleteUserRepository: IDeleteUserRepository = {
        async delete(id: string) {
            return {
                message: 'User deleted with success!'
            }
        },
    }

    return {
        deleteUserRepository
    }
}

const makeDeleteUserController = () => {
    const { deleteUserRepository } = makeFakeRepository()

    const deleteUserController = new DeleteUserController(deleteUserRepository)

    return {
        deleteUserController
    }

}

describe('Delete User', () => {
    it('should a delete user', async () => {
        const { deleteUserController } = makeDeleteUserController()
        const user = CreateUserValid({})

        const { body, statusCode } = await deleteUserController.handle({
            params: {
                userId: user.id
            }
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('User deleted with success!')

    })

    it('should return a error when `userId` params is not provided', async () => {
        const { deleteUserController } = makeDeleteUserController()

        const { body, statusCode } = await deleteUserController.handle({
            params: {}
        })

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Params is not corrected, userId is missing!')
        expect(body.success).toBeFalsy()

    })

    it('should return a error when params is not provided', async () => {
        const { deleteUserController } = makeDeleteUserController()
        
        const { body, statusCode } = await deleteUserController.handle({})

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Params is not corrected, userId is missing!')
        expect(body.success).toBeFalsy()

    })
})