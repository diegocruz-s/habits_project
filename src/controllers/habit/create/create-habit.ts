import { randomUUID } from "crypto";

import { Habit } from "../../../entities/habit/Habit";
import { HabitWeekDay } from "../../../entities/weekDays/HabitWeekDay";
import { validation } from "../../../helpers/validation";
import { CreateHabitSchema } from "../../../validation/Habit/CreateHabit";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";
import { ICreateHabitController, ICreateHabitRepository, ICreateHabitResponse, IDatasCreateHabit } from "./protocols";

export class CreateHabitController implements ICreateHabitController {
    constructor(
        private readonly createHabitRepository: ICreateHabitRepository
    ) {}

    async handle(httpRequest: HttpRequest<IDatasCreateHabit>): Promise<HttpResponse<ICreateHabitResponse>> {
        
        try {    
            if(!httpRequest.params?.userId) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Params is not correctes, userId is missing!'],
                        habit: null,
                        success: ''
                    }
                }
            }
            
            if(!httpRequest.body) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Body is not defined!'],
                        habit: null,
                        success: ''
                    }
                }
            }
            const { userId } = httpRequest.params
            const { body } = httpRequest

            const validationBody = await validation({
                content: body,
                schema: CreateHabitSchema
            })
    
            if (validationBody.errors) {
                return {
                    statusCode: 400,
                    body: {
                        errors: validationBody.errors,
                        habit: null,
                        success: ''
                    }
                }
            }

            if(body.numbersOfWeek <= 0) {
                return {
                    statusCode: 400,
                    body: {
                        errors: ['Value numbersOfWeek must be a positive!'],
                        habit: null,
                        success: ''
                    }
                }
            }            

            const createdAt = new Date()
            createdAt.setHours(0, 0, 0, 0)
            
            const habit = new Habit(randomUUID(), body.title, createdAt, body.numbersOfWeek, userId)
            for (let i=0;i<body.weekDays.length;i++) {
                const newWeekDay = new HabitWeekDay(randomUUID(), habit.id, body.weekDays[i])
                habit.setWeekDays(newWeekDay)
            }

            const newHabit = await this.createHabitRepository.create(habit)

            return {
                statusCode: 201,
                body: {
                    errors: null,
                    habit: newHabit,
                    success: 'Habit created with successfully!'
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
