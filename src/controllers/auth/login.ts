import { User } from "../../entities/user/User";
import { validation } from "../../helpers/validation";
import { loginSchema } from "../../validation/Login/LoginSchema";
import { HttpRequest, HttpResponse } from "../globalInterfaces";
import { ICheckPasswordHash, IDatasLogin, IDatasResponseLogin, ILoginController, ILoginRepository, ITokenGenerator } from "./protocols";

export class LoginController implements ILoginController {

    constructor(
        private readonly loginRepository: ILoginRepository,
        private readonly tokenGenerator: ITokenGenerator,
        private readonly checkPasswordHash: ICheckPasswordHash
    ) {}

    async handle(httpRequest: HttpRequest<IDatasLogin>): Promise<HttpResponse<IDatasResponseLogin>> {
        const { body } = httpRequest

        const resultValidation = await validation({
            schema: loginSchema,
            content: body
        })

        if (resultValidation.errors) {
            return {
                statusCode: 400,
                body: {
                    errors: resultValidation.errors,
                    user: null,
                    token: ''
                }
            }
        }

        try {

            const user = await this.loginRepository.login({
                email: body!.email,
                password: body!.password
            })

            const resultCheckPwd = await this.checkPasswordHash.compare(body!.password, user.password)

            if (!resultCheckPwd) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Authentication failed!'],
                        user: null,
                        token: ''
                    }
                }
            }

            const { password: pwdUser, ...rest } = user

            const token = await this.tokenGenerator.generate(user.id)

            return {
                body: {
                    errors: null,
                    user: rest,
                    token
                },
                statusCode: 200
            }

        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    user: null,
                    token: ''
                }
            }
        }

    }
}