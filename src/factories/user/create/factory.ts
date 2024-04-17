import { CreateUserController } from "../../../controllers/user/create/create-user"
import { HashPasswordBcrypt } from "../../../helpers/hashBcrypt"
import { CreateUserRepository } from "../../../repositories/User/create/prisma-create-user"

interface IMakeControllerCreateUser {
    createUserController: CreateUserController
}

export const makeControllerCreateUser = (): IMakeControllerCreateUser => {
    const createUserRepository = new CreateUserRepository()
    const hashPasswordBcrypt = new HashPasswordBcrypt()

    const createUserController = new CreateUserController({
        createUserRepository,
        encrypterPwd: hashPasswordBcrypt
    })

    return {
        createUserController
    }
}