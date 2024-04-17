import { Habit } from "../../../entities/habit/Habit"
import { HabitWeekDay } from "../../../entities/weekDays/HabitWeekDay"
import { HttpRequest, HttpResponse } from "../../globalInterfaces"

export interface IDatasUpdateHabit {
    numbersOfWeek?: number
    title?: string
}

export interface IDatasHabitUpdateController extends IDatasUpdateHabit {
    weekDays?: number[]
}

export interface IDatasHabitUpdateRepository extends IDatasUpdateHabit {
    weekDays?: HabitWeekDay[]
}

export interface IReturnUpdateHabit {
    errors: string[] | null
    success: string 
    habit: Habit | null
}

export interface IUpdateHabitController {
    handle(httpRequest: HttpRequest<IDatasHabitUpdateController>): Promise<HttpResponse<IReturnUpdateHabit>>
}

export interface IUpdateHabitRepository {
    update(habitId: string, userId: string, datas: IDatasHabitUpdateRepository): Promise<Habit>
    findHabit(habitId: string, userId: string): Promise<Habit>
}

