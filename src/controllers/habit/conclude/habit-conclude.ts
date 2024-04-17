import { randomUUID } from "crypto";
import { Day } from "../../../entities/day/Day";
import { validation } from "../../../helpers/validation";
import { ConcludeAndUndoHabit } from "../../../validation/Habit/ConcludeAndUndoHabit";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { IConcludeHabitController, IConcludeHabitRepository, IResponseConcludeHabit } from "./protocols";

export class HabitConcludeController implements IConcludeHabitController {
    constructor(
        private readonly concludeHabitRepository: IConcludeHabitRepository
    ) {}
    async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IResponseConcludeHabit>> {
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
                        habitConclude: null,
                        success: ''
                    }
                }
            }

            const day = new Day(randomUUID(), httpRequest.params.date)
            const habitConclude = await this.concludeHabitRepository.conclude(
                httpRequest.params.habitId, httpRequest.params.userId, day
            )
            
                        
            return {
                statusCode: 200,
                body: {
                    errors: null,
                    habitConclude,
                    success: 'Habit conclude with success!'
                }
            }

        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    habitConclude: null,
                    success: ''
                }
            }
        }
    }
}
