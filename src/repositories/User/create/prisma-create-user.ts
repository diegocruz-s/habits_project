import { ICreateUserRepository } from "../../../controllers/user/create/protocols";
import { prisma } from "../../../database/prisma-client";
import { User } from "../../../entities/user/User";

export class CreateUserRepository implements ICreateUserRepository {
    async create(user: User): Promise<User> {
        const userWithExistingEmail = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        if(userWithExistingEmail) {
            throw new Error('User with existing email. Please change other!')
        }

        const newUser = await prisma.user.create({
            data: user
        })

        if(!newUser) {
            throw new Error('User not created!')
        }

        const newUserEntity = new User(newUser.id, newUser.name, newUser.email, newUser.password)

        return newUserEntity
        
    }
}