import { UpdateUserController } from "../../../controllers/user/update/update-user"
import { HashPasswordBcrypt } from "../../../helpers/hashBcrypt"
import { UpdateUserRepository } from "../../../repositories/User/update/prisma-update.user"

interface IMakeControllerUpdateUser {
    updateUserController: UpdateUserController
}

export const makeControllerUpdateUser = (): IMakeControllerUpdateUser => {
    const updateUserRepository = new UpdateUserRepository()
    const hashPasswordBcrypt = new HashPasswordBcrypt()
    const updateUserController = new UpdateUserController(updateUserRepository, hashPasswordBcrypt)

    return {
        updateUserController
    }
}