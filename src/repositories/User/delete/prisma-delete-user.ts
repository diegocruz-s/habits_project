import { IDeleteUserRepository } from "../../../controllers/user/delete/protocols";
import { prisma } from "../../../database/prisma-client";

export class DeleteUserRepository implements IDeleteUserRepository {
    async delete(id: string): Promise<{ message: string; }> {
        const user = await prisma.user.findFirst({
            where: {
                AND: [
                    { id }, { isActive: true }
                ]
            }
        })

        if(!user) throw new Error('User not found!')

        const deletedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isActive: false
            }
        })

        if (!deletedUser) throw new Error('Error deleted user!')

        return {
            message: 'User deleted with success!'
        }

    }
}