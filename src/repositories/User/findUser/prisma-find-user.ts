import { IFindUserRepository } from "../../../controllers/user/findUser/protocols";
import { prisma } from "../../../database/prisma-client";
import { User } from "../../../entities/user/User";

export class FindUserRepository implements IFindUserRepository {
    async findUser(id: string): Promise<Omit<User, "password">> {
        const userById = await prisma.user.findUnique({
            where: { id }
        })

        if(!userById) throw new Error('User not found!')

        const user = new User(id, userById.name, userById.email, userById.password)

        const { password, ...rest } = user

        return rest as Omit<User, 'password'>
        
    }
}
