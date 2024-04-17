import request from 'supertest'
import { app } from '../../index'

describe('[e2e] Create User', () => {
    
    it('should create User', async () => {
        const datasUser = {
            name: 'Diego',
            email: 'diego@gmail.com',
            password: 'Diego@123'
        }
        const response = await request(app)
            .post('/user')
            .send(datasUser)

        expect(response.status).toBe(201)
        expect(response.body.user).toBeTruthy()
        expect(response.body.user.email).toBe(datasUser.email)
        expect(response.body.user.name).toBe(datasUser.name)
        expect(response.body.user.password).not.toBe(datasUser.password)
    })

    it('should return error when datas is not provided', async () => {
        const datasUser = {
            name: '',
            email: '',
            password: ''
        }
        const response = await request(app)
            .post('/user')
            .send(datasUser)
    
        expect(response.status).toBe(400)
        expect(response.body.user).toBeNull()
        expect(response.body.errors.length).toBe(3)
    })

    it('should return error when body is not provided', async () => {
        const response = await request(app)
            .post('/user')
            .send()
                
        expect(response.status).toBe(400)
        expect(response.body.user).toBeNull()
        expect(response.body.errors).toBeTruthy()
    })

    it('should return error when email is not valid', async () => {
        const datasUser = {
            name: 'any_name',
            email: 'any_email',
            password: 'any_pass'
        }
        const response = await request(app)
            .post('/user')
            .send(datasUser)
    
        expect(response.status).toBe(400)
        expect(response.body.user).toBeNull()
        expect(response.body.errors.length).toBe(1)
        expect(response.body.errors[0]).toContain('email')
    })

    it('should return error when email already in use', async () => {
        const email = 'any_content@gmail.com'
        const datasUser = {
            name: 'any_name',
            email,
            password: 'any_pass'
        }
        const responseOne = await request(app)
            .post('/user')
            .send(datasUser)
    
        expect(responseOne.status).toBe(201)
        expect(responseOne.body.user).toBeTruthy()
        expect(responseOne.body.errors).toBeNull()

        const responseTwo = await request(app)
            .post('/user')
            .send(datasUser)
        
        expect(responseTwo.status).toBe(500)
        expect(responseTwo.body.errors[0]).toContain('email')
        expect(responseTwo.body.user).toBeNull()
    })
})


