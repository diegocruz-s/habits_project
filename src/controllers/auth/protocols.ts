import { User } from "../../entities/user/User";
import { HttpRequest, HttpResponse } from "../globalInterfaces";

export interface IDatasLogin {
    email: string
    password: string
}

export interface IDatasResponseLogin {
    user: Partial<User> | null
    errors: string[] | null
    token: string
}

export interface ICheckPasswordHash {
    compare(password: string, hash: string): Promise<boolean>
}

export interface ITokenGenerator {
    generate(id: string): Promise<string>
}

export interface ILoginRepository {
    login(datas: IDatasLogin): Promise<User> 
}

export interface ILoginController {
    handle(httpRequest: HttpRequest<IDatasLogin>): Promise<HttpResponse<IDatasResponseLogin>>
}
