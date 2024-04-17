import { Habit } from "../../../entities/habit/Habit";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";

export interface IListHabitsResponse {
    completeHabits: Habit[]
    possibleHabits: Habit[]
}

export interface IReadHabitsByDayResponse {
    errors?: string[] | null
    habits?: IListHabitsResponse | null
}

export interface IReadHabitsByDayController { 
    handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReadHabitsByDayResponse>>
}

export interface IReadHabitsByDayRepository {
    allHabitsDay(date: Date, userId: string): Promise<Habit[]>
    concludesHabitsDay(date: Date, userId: string): Promise<Habit[]>
}

// possibles
// completes
    // isActive = true
