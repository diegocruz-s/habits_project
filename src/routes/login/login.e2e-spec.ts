import request from "supertest"

import { prisma } from "../../database/prisma-client"
import { app } from "../../index"

describe('[e2e] Login', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany()
    })

    it('should login user and return token when datas correct', async () => {
        const datasUser = {
            name: 'AnyName',
            email: 'login_test_user@gmail.com',
            password: 'Any_Pass@123'
        }
        const createUserResponse = await request(app)
            .post('/user')
            .send(datasUser)
            
        expect(createUserResponse.status).toBe(201)
        expect(createUserResponse.body.user).toBeTruthy()
        expect(createUserResponse.body.user.email).toBe(datasUser.email)
        
        const responseLogin = await request(app)
            .post('/auth')
            .send({
                email: datasUser.email,
                password: datasUser.password
            })

        expect(responseLogin.status).toBe(200)
        expect(responseLogin.body.user.email).toBe(datasUser.email)
        expect(responseLogin.body.user).not.toHaveProperty('password')
        expect(responseLogin.body.token).toBeTruthy()
        expect(responseLogin.body.token.length).toBeGreaterThan(1)


    })

    it('should not authenticated user when email is not correct', async () => {
        const datasUser = {
            name: 'AnyName',
            email: 'login_test_user@gmail.com',
            password: 'Any_Pass@123'
        }
        const createUserResponse = await request(app)
            .post('/user')
            .send(datasUser)
            
        expect(createUserResponse.status).toBe(201)
        expect(createUserResponse.body.user).toBeTruthy()
        expect(createUserResponse.body.user.email).toBe(datasUser.email)
        
        const responseLogin = await request(app)
            .post('/auth')
            .send({
                email: 'any_email@gmail.com',
                password: datasUser.password
            })

        expect(responseLogin.status).toBe(500)
        expect(responseLogin.body.user).toBeNull()
        expect(responseLogin.body.token).toBeFalsy()
        expect(responseLogin.body.errors.length).toBe(1)
        expect(responseLogin.body.errors![0].toLowerCase()).toContain('user')


    })

    it('should not authenticated user when password is not correct', async () => {
        const datasUser = {
            name: 'AnyName',
            email: 'login_test_user@gmail.com',
            password: 'Any_Pass@123'
        }
        const createUserResponse = await request(app)
            .post('/user')
            .send(datasUser)
            
        expect(createUserResponse.status).toBe(201)
        expect(createUserResponse.body.user).toBeTruthy()
        expect(createUserResponse.body.user.email).toBe(datasUser.email)
        
        const responseLogin = await request(app)
            .post('/auth')
            .send({
                email: datasUser.email,
                password: 'Pass@123'
            })

        expect(responseLogin.status).toBe(400)
        expect(responseLogin.body.user).toBeNull()
        expect(responseLogin.body.token).toBeFalsy()
        expect(responseLogin.body.errors.length).toBe(1)
        expect(responseLogin.body.errors![0].toLowerCase()).toContain('authentication')


    })

    it('should not authenticated user when datas is not provided', async () => {
        const responseLogin = await request(app)
            .post('/auth')
            .send({})

        expect(responseLogin.status).toBe(400)
        expect(responseLogin.body.user).toBeNull()
        expect(responseLogin.body.token).toBeFalsy()
        expect(responseLogin.body.errors.length).toBe(2)
    })

    it('should not authenticated when user is not exists', async () => {
        const responseLogin = await request(app)
            .post('/auth')
            .send({
                email: 'any_email@gmail.com',
                password: 'AnyPass@gmail.com',
            })

        expect(responseLogin.status).toBe(500)
        expect(responseLogin.body.user).toBeNull()
        expect(responseLogin.body.token).toBeFalsy()
        expect(responseLogin.body.errors.length).toBe(1)
        expect(responseLogin.body.errors![0].toLowerCase()).toContain('user')
    })
})