import { DeleteUserController } from "../../../controllers/user/delete/delete-user"
import { DeleteUserRepository } from "../../../repositories/User/delete/prisma-delete-user"

export const makeControllerDeleteUser = () => {
    const prismaDeleteUserRepository = new DeleteUserRepository()
    const deleteUserController = new DeleteUserController(prismaDeleteUserRepository)

    return {
        deleteUserController
    }
}