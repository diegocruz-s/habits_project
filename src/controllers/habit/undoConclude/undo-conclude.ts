import { validation } from "../../../helpers/validation";
import { ConcludeAndUndoHabit } from "../../../validation/Habit/ConcludeAndUndoHabit";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { IReturnUndoConcludeResponse, IUndoConcludeController, IUndoConcludeRepository } from "./protocols";

export class UndoConcludeController implements IUndoConcludeController {
    constructor (
        private readonly undoConcludeRepository: IUndoConcludeRepository
    ) {}

    async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReturnUndoConcludeResponse>> {
        try {
            const validationParams = await validation({
                schema: ConcludeAndUndoHabit,
                content: httpRequest.params
            })
    
            if (validationParams.errors) {
                return {
                    statusCode: 422,
                    body: {
                        errors: validationParams.errors,
                        habit: null,
                        success: ''
                    }
                }
            }

            const habit = await this.undoConcludeRepository.undoConclude(
                httpRequest.params.habitId, httpRequest.params.userId, httpRequest.params.date
            )

            return {
                statusCode: 200,
                body: {
                    errors: null,
                    success: 'Habit undo conclude with success!',
                    habit
                }
            }

        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    habit: null,
                    success: ''
                }
            }
        }
    }
}