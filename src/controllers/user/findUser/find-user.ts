import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { IFindUserController, IFindUserRepository, IResponseFindUser } from "./protocols";

export class FindUserController implements IFindUserController {
    constructor (
        private readonly findUserRepository: IFindUserRepository
    ) {}
    
    async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IResponseFindUser>> {
        try {
            if(!httpRequest.params?.userId) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Params is not corrected, userId is missing!'],
                        user: null
                    }
                }
            }

            const user = await this.findUserRepository.findUser(httpRequest.params.userId)

            return {
                statusCode: 200,
                body: {
                    errors: null,
                    user
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