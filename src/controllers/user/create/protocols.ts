import { IDatasNewUser, User } from "../../../entities/user/User";
import { HttpRequest, HttpResponse } from "../../globalInterfaces";

export type ICreateUserResponse = {
    user: User | null
    errors: string[] | null
}


export interface ICreateUserController {
    handle(httpRequest: HttpRequest<IDatasNewUser>): Promise<HttpResponse<ICreateUserResponse>>
}

export interface ICreateUserRepository {
    create(user: User): Promise<User>
}

export interface IHashPassword {
    hash(password: string): Promise<string>
}

