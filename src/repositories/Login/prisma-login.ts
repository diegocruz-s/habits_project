import { IDatasLogin, ILoginRepository } from "../../controllers/auth/protocols";
import { prisma } from "../../database/prisma-client";
import { User } from "../../entities/user/User";

export class PrismaLoginRepository implements ILoginRepository {
    async login(datas: IDatasLogin): Promise<User> {
        const user = await prisma.user.findFirst({
            where: {
                AND: [
                    { email: datas.email },
                    { isActive: true }
                ]
            }
        })

        if(!user) {
            throw new Error('User not found!')
        }

        const userEntity = new User(
            user.id,
            user.name,
            user.email,
            user.password 
        )

        return userEntity

    }
}
