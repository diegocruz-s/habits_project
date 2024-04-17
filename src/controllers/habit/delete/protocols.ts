import { HttpRequest, HttpResponse } from "../../globalInterfaces"

export interface IReturnDeleteHabit {
    errors: string[] | null
    message: string | null
}

export interface IDeleteHabitController {
    handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReturnDeleteHabit>>
}

export interface IDeleteHabitRepository {
    delete(habitId: string, userId: string): Promise<{ message: string }>
}
