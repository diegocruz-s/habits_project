import { Habit } from "../../../entities/habit/Habit"
import { HttpRequest, HttpResponse } from "../../globalInterfaces"

export interface IReturnUndoConcludeResponse {
    errors: string[] | null
    success: string
    habit: Habit | null
}

export interface IUndoConcludeController {
    handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReturnUndoConcludeResponse>> 
}

export interface IUndoConcludeRepository {
    undoConclude(habitId: string, userId: string, date: Date): Promise<Habit>
}