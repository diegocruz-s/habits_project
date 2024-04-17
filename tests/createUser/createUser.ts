import request from 'supertest'
import { app } from '../../src'
import { faker } from '@faker-js/faker'

export async function createUser () {
    const password = faker.internet.password()
    const createUserResponse = await request(app)
            .post('/user')
            .send({
                name: faker.internet.userName(),
                email: faker.internet.email(),
                password
            })
    expect(createUserResponse.status).toBe(201)
    expect(createUserResponse.body.user).toBeTruthy()

    return {
        user: createUserResponse.body.user,
        password
    }
}