import { IHashPassword } from "../controllers/user/create/protocols";
import { hashSync } from 'bcrypt'

export class HashPasswordBcrypt implements IHashPassword {
    async hash(password: string): Promise<string> {
        const newPwd = hashSync(password, 12)

        return newPwd
    }
}
