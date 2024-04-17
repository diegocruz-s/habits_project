import request from 'supertest'
import { createUser } from "../createUser/createUser";
import { app } from '../../src';

export async function login () {
    const { user, password } = await createUser()
    
    const responseLogin = await request(app)
            .post('/auth')
            .send({
                email: user.email,
                password
            })
    expect(responseLogin.status).toBe(200)
    expect(responseLogin.body.user).toBeTruthy()
    expect(responseLogin.body.token).toBeTruthy()    

    return {
        body: responseLogin.body,
        user: responseLogin.body.user,
        errors: responseLogin.body.errors,
        token: responseLogin.body.token,
    }
}