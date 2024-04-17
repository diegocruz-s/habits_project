import { compareSync } from "bcrypt";
import { ICheckPasswordHash } from "../controllers/auth/protocols";

export class ComparePasswordHashBcrpyt implements ICheckPasswordHash {
    async compare(password: string, hash: string): Promise<boolean> {
        const resultCheck = compareSync(password, hash)

        return resultCheck
    }
}
