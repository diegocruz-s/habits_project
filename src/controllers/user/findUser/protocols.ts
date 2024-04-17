import { User } from "../../../entities/user/User";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";

export interface IResponseFindUser {
    errors: string[] | null
    user: Omit<User, 'password'> | null
}

export interface IFindUserController {
    handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<IResponseFindUser>> 
}

export interface IFindUserRepository {
    findUser(id: string): Promise<Omit<User, 'password'>>
}

