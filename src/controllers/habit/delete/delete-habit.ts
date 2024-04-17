import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { IDeleteHabitController, IDeleteHabitRepository, IReturnDeleteHabit } from "./protocols";

export class DeleteHabitController implements IDeleteHabitController {
    constructor(
        private readonly deleteHabitRepository: IDeleteHabitRepository
    ) {}

    async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReturnDeleteHabit>> {
        try {
            if(!httpRequest.params?.habitId || !httpRequest.params?.userId) {
                return {
                    statusCode: 422,
                    body: {
                        errors: ['Params is not corrected!'],
                        message: null
                    }
                }
            }
            const { habitId, userId } = httpRequest.params

            const { message } = await this.deleteHabitRepository.delete(habitId, userId)

            return {
                statusCode: 200,
                body: {
                    errors: null,
                    message
                }
            }

        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    message: null
                }
            }
        }
    }
}