import { FindUserController } from "../../../controllers/user/findUser/find-user"
import { IFindUserController } from "../../../controllers/user/findUser/protocols"
import { FindUserRepository } from "../../../repositories/User/findUser/prisma-find-user"

interface IReturnMakeControllerFindUser {
    findUserController: IFindUserController
}

export const makeControllerFindUser = (): IReturnMakeControllerFindUser => {
    const findUserRepository = new FindUserRepository()
    const findUserController = new FindUserController(findUserRepository)

    return {
        findUserController
    }
}
