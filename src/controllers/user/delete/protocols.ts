import { HttpRequest, HttpResponse } from "../../globalInterfaces";

export interface IReturnDeleteUserController {
    success: string
    errors: string[] | null
}

export interface IDeleteUserController {
    handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IReturnDeleteUserController>>
}

export interface IDeleteUserRepository {
    delete(id: string): Promise<{ message: string }>
}