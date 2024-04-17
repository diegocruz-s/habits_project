import { IDatasNewUser, User } from "../../../entities/user/User";
import { validation } from "../../../helpers/validation";
import { createUserSchema } from "../../../validation/User/CreateUserSchema";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { ICreateUserController, ICreateUserRepository, ICreateUserResponse, IHashPassword } from "./protocols";

interface ParametersCreateUserController {
    createUserRepository: ICreateUserRepository
    encrypterPwd: IHashPassword
}

export class CreateUserController implements ICreateUserController {
    private readonly createUserRepository: ICreateUserRepository
    private readonly encrypterPwd: IHashPassword

    constructor(
        { createUserRepository, encrypterPwd }: ParametersCreateUserController
    ) {
        this.createUserRepository = createUserRepository
        this.encrypterPwd = encrypterPwd
    }

    async handle(httpRequest: HttpRequest<IDatasNewUser>): Promise<HttpResponse<ICreateUserResponse>> {
        try {
            const { body } = httpRequest

            const resultValidation = await validation({
                schema: createUserSchema,
                content: body
            })

            if (resultValidation.errors) {
                return {
                    statusCode: 400,
                    body: {
                        errors: resultValidation.errors,
                        user: null
                    }
                }
            }
            
            if(!body) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Body is not defined!'],
                        user: null
                    }
                }
            }

            const passwordHash = await this.encrypterPwd.hash(body.password)

            const newUser = new User(body.id, body.name, body.email, passwordHash)

            const user = await this.createUserRepository.create(newUser)

            return {
                statusCode: 201,
                body: {
                    user,
                    errors: null
                }
            }
        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    user: null
                }
            }
        }
    }
}