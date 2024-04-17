import { validation } from "../../../helpers/validation";
import { updateUserSchema } from "../../../validation/User/UpdateUserSchema";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { IHashPassword } from "../create/protocols";
import { IDatasUpdate, IReturnDatasUpdateUser, IUpdateUserController, IUpdateUserRepository } from "./protocols";

export class UpdateUserController implements IUpdateUserController {
    constructor(
        private readonly updateUserRepository: IUpdateUserRepository,
        private readonly encrypterPwd: IHashPassword
    ) {}

    async handle(httpRequest: HttpRequest<IDatasUpdate>): Promise<HttpResponse<IReturnDatasUpdateUser>> {
        try {
            if(!httpRequest.params?.userId) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Params is not corrected, userId is missing!'],
                        success: '',
                        user: null
                    }
                }
            }

            const valuesFieldsUpdate: (keyof IDatasUpdate)[] = ['email', 'name', 'password']

            if(Object.keys(httpRequest.body!).length === 0) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['No datas sent!'],
                        success: '',
                        user: null
                    }
                }
            }
            
            const keysErrors = Object.keys(httpRequest.body!).some(
                key => !valuesFieldsUpdate.includes(key as keyof IDatasUpdate)
            ) 

            if(keysErrors) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Invalid datas!'],
                        success: '',
                        user: null
                    }
                }
            }

            const resultValidation = await validation({
                schema: updateUserSchema,
                content: httpRequest.body!
            })

            if (resultValidation.errors) {
                return {
                    statusCode: 400,
                    body: {
                        errors: resultValidation.errors,
                        success: '',
                        user: null
                    }
                }
            } 
            
            let newDatasUser: IDatasUpdate = {
                ...httpRequest.body
            }

            if(httpRequest.body?.password) {
                const newPwd = await this.encrypterPwd.hash(httpRequest.body.password)
                newDatasUser = {
                    ...newDatasUser,
                    password: newPwd
                }
            }

            const user = await this.updateUserRepository.update(httpRequest.params.userId, newDatasUser)

            return {
                statusCode: 200,
                body: {
                    errors: null,
                    success: 'User updated with successfully!',
                    user
                }
            }

        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    success: '',
                    user: null
                }
            }
        }
    }
}