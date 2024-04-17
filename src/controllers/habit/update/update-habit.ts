import { randomUUID } from "crypto";

import { Habit } from "../../../entities/habit/Habit";
import { HabitWeekDay } from "../../../entities/weekDays/HabitWeekDay";
import { validation } from "../../../helpers/validation";
import { updateHabitSchema } from "../../../validation/Habit/UpdateHabit";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { IDatasHabitUpdateController, IDatasHabitUpdateRepository, IReturnUpdateHabit, IUpdateHabitController, IUpdateHabitRepository } from "./protocols";

export class UpdateHabitController implements IUpdateHabitController {
    constructor (
        private readonly updateHabitRepository: IUpdateHabitRepository
    ) {}

    async handle(httpRequest: HttpRequest<IDatasHabitUpdateController>): Promise<HttpResponse<IReturnUpdateHabit>> {
        try {
            if(!httpRequest.params?.habitId || !httpRequest.params?.userId) {
                return {
                    statusCode: 422,
                    body: {
                        errors: ['Params is not corrected!'],
                        success: '',
                        habit: null
                    }
                }
            }
            const valuesFieldsUpdate: (keyof IDatasHabitUpdateController)[] = ['numbersOfWeek', 'title', 'weekDays']
            
            if(Object.keys(httpRequest.body!).length === 0) {
                return {
                    statusCode: 422,
                    body: {
                        errors: [`No datas sent!`],
                        success: '',
                        habit: null
                    }
                }
            }

            const errorsInPropertiesForUpdate = Object.keys(httpRequest.body!).some(
                property => !valuesFieldsUpdate.includes(property as keyof IDatasHabitUpdateController)
            )

            if(errorsInPropertiesForUpdate) {
                return {
                    statusCode: 422,
                    body: {
                        errors: [`Invalid datas!`],
                        success: '',
                        habit: null
                    }
                }
            }

            const resultValidation = await validation({
                schema: updateHabitSchema,
                content: httpRequest.body!
            })

            if (resultValidation.errors) {
                return {
                    statusCode: 400,
                    body: {
                        errors: resultValidation.errors,
                        success: '',
                        habit: null
                    }
                }
            } 

            const actualHabit = await this.updateHabitRepository.findHabit(
                httpRequest.params.habitId, httpRequest.params.userId
            )
            if (httpRequest.body?.numbersOfWeek && 
                httpRequest.body?.numbersOfWeek < actualHabit.numbersOfWeek
            ) {
                return {
                    statusCode: 422,
                    body: {
                        errors: [`You can only update the habit for more weeks!`],
                        success: '',
                        habit: null
                    }
                }
            }

            let datasUpdateHabitRepository: IDatasHabitUpdateRepository = {}

            if (httpRequest.body?.weekDays) {
                let datasWeekDays: HabitWeekDay[] = []
                for (const weekDay of httpRequest.body.weekDays) {
                    const habitWeekDay = new HabitWeekDay(
                        randomUUID(),
                        httpRequest.params.habitId,
                        weekDay
                    )
                    datasWeekDays.push(habitWeekDay)
                }

                datasUpdateHabitRepository = {
                    ...httpRequest.body,
                    weekDays: datasWeekDays
                }
            } else {
                datasUpdateHabitRepository = {
                    ...httpRequest.body
                } as IDatasHabitUpdateRepository
            }

            const updatedHabit = await this.updateHabitRepository.update(
                httpRequest.params.habitId, httpRequest.params.userId, datasUpdateHabitRepository
            )
            
            return {
                statusCode: 200,
                body: {
                    errors: null,
                    success: 'Habit updated with success!',
                    habit: updatedHabit
                }
            }
        
        } catch (error: any) {
            return {
                statusCode: 500,
                body: {
                    errors: [`${error.message || 'Internal server error!'}`],
                    success: '',
                    habit: null
                }
            }
        }
    }
}