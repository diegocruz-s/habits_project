import { User } from "../../../entities/user/User"
import { HttpRequest, HttpResponse } from "../../globalInterfaces"

export interface IDatasUpdate {
    name?: string,
    email?: string,
    password?: string,
}

export interface IReturnDatasUpdateUser {
    errors: string[] | null
    success: string
    user: Omit<User, 'password'> | null
}

export interface IUpdateUserController {
    handle(httpRequest: HttpRequest<IDatasUpdate>): Promise<HttpResponse<IReturnDatasUpdateUser>>
}

export interface IUpdateUserRepository {
    update(id: string, datas: IDatasUpdate): Promise<Omit<User, 'password'>>
}