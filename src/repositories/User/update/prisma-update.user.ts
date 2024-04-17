import { IDatasUpdate, IUpdateUserRepository } from "../../../controllers/user/update/protocols";
import { prisma } from "../../../database/prisma-client";
import { User } from "../../../entities/user/User";

export class UpdateUserRepository implements IUpdateUserRepository {
    async update(id: string, datas: IDatasUpdate): Promise<Omit<User, "password">> {
        const user = await prisma.user.findFirst({
            where: {
                AND: [
                    { id }, { isActive: true }
                ]
            }
        })

        if(!user) throw new Error('User not found!')

        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: datas
        })

        if(!updatedUser) throw new Error('Error updated user!')

        const newUserUpdates = new User(updatedUser.id, updatedUser.name, updatedUser.email, updatedUser.password)

        const { password, ...rest } = newUserUpdates

        return rest as Omit<User, 'password'>

    }
}