import { LoginController } from "../../controllers/auth/login"
import { ILoginController } from "../../controllers/auth/protocols"
import { ComparePasswordHashBcrpyt } from "../../helpers/comparePasswordHashBcrypt"
import { TokenGeneratorJwt } from "../../helpers/tokenGeneratorJwt"
import { PrismaLoginRepository } from "../../repositories/Login/prisma-login"

interface IMakeControllerLogin {
    loginController: ILoginController
}

export const makeLoginController = (): IMakeControllerLogin => {
    const loginRepository = new PrismaLoginRepository()
    const tokenGenerator = new TokenGeneratorJwt()
    const checkPasswordHash = new ComparePasswordHashBcrpyt()

    const loginController = new LoginController(
        loginRepository,
        tokenGenerator,
        checkPasswordHash
    )

    return {
        loginController
    }
}
