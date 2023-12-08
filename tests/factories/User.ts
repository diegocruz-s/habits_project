import { User, UserModel } from "../../src/entities/user/User"
import { faker } from '@faker-js/faker'

export const CreateUserValid = (): User => {
    const datasUser: UserModel = {
        id: faker.string.uuid(),
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }

    const user: User = new User(
        datasUser.id,
        datasUser.name,
        datasUser.email,
        datasUser.password
    )

    if (!user.isValid()) {
        throw new Error('Error create a new User in Factory test')
    }

    return user
    
}