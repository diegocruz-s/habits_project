import { faker } from '@faker-js/faker'

import { IDatasNewUser, User } from "../../src/entities/user/User"

interface PossibleDatas {
    id?: string
    email?: string
    password?: string
}
export const CreateUserValid = ({ id, email, password }: PossibleDatas): User => {
    const datasUser: IDatasNewUser = {
        id: id || faker.string.uuid(),
        name: faker.internet.userName(),
        email: email || faker.internet.email(),
        password: password || faker.internet.password()
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