import { prisma } from "../../../database/prisma-client";
import { Day } from "../../../entities/day/Day";
import { DayHabitConclude } from "../../../entities/dayHabitsConcludes/DayHabitConclude";
import { Habit } from "../../../entities/habit/Habit";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";

export interface IResponseConcludeHabit {
    habitConclude: DayHabitConclude | null
    errors: string[] | null
    success: string
}

export interface IConcludeHabitController {
    handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IResponseConcludeHabit>>
}

export interface IConcludeHabitRepository {
    conclude(habitId: string, userId: string, day: Day): Promise<DayHabitConclude>

}
