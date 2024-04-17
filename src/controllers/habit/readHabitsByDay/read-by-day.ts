import { validation } from '../../../helpers/validation';
import { ReadByDayHabits } from '../../../validation/Habit/ReadByDay';
import { HttpRequest, HttpResponse } from '../../globalInterfaces';
import { IReadHabitsByDayController, IReadHabitsByDayRepository, IReadHabitsByDayResponse } from './protocols'

export class ReadHabitsByDayController implements IReadHabitsByDayController {
    constructor(
        private readonly readByDayRepository: IReadHabitsByDayRepository
    ) {}

    async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReadHabitsByDayResponse>> {
        try {

            const validationBody = await validation({
                content: httpRequest.params,
                schema: ReadByDayHabits
            })
    
            if (validationBody.errors) {
                return {
                    statusCode: 400,
                    body: {
                        errors: validationBody.errors,
                        habits: null,
                    }
                }
            }
            
            const [ allHabits, completeHabits ] = await Promise.all([
                this.readByDayRepository.allHabitsDay(httpRequest.params.date, httpRequest.params.userId),
                this.readByDayRepository.concludesHabitsDay(httpRequest.params.date, httpRequest.params.userId)
            ])
            
            const habitsNotConcluded = allHabits.filter(
                habit => !completeHabits.some(completeHabit => habit.id === completeHabit.id)
            )

            return {
                statusCode: 200,
                body: {
                    errors: null,
                    habits: {
                        possibleHabits: habitsNotConcluded,
                        completeHabits
                    }
                }
            }

        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    habits: null
                }
            }
        }
    }
}
