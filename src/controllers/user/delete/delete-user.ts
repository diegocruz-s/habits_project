import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { IDeleteUserController, IDeleteUserRepository, IReturnDeleteUserController } from "./protocols";

export class DeleteUserController implements IDeleteUserController {
    constructor (
        private readonly deleteUserRepository: IDeleteUserRepository
    ) {}

    async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReturnDeleteUserController>> {
        try {
            if(!httpRequest.params?.userId) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Params is not corrected, userId is missing!'],
                        success: ''
                    }
                }
            }
            
            const { message } = await this.deleteUserRepository.delete(httpRequest.params.userId)
            
            return {
                statusCode: 200,
                body: {
                    errors: null,
                    success: message
                }
            }

        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    success: ''
                }
            }
        }
    }
}