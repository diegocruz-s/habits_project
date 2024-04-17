import { Habit } from "../../../entities/habit/Habit";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";

export interface ICreateHabitResponse {
    habit: Habit | null
    success: string
    errors: string[] | null
}

export interface IDatasCreateHabit {
    title: string,
    numbersOfWeek: number,
    weekDays: number[],
}

export interface ICreateHabitRepository {
    create(datas: Habit): Promise<Habit>
}

export interface ICreateHabitController {
    handle(httpRequest: HttpRequest<Omit<IDatasCreateHabit, 'userId'>>): Promise<HttpResponse<ICreateHabitResponse>>
}
