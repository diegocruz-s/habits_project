import request from 'supertest'
import { login } from '../../../tests/login/login'
import { app } from '../..'
import { prisma } from '../../database/prisma-client'
import { createUser } from '../../../tests/createUser/createUser'

describe('[e2e] User Update', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany()
    })

    it('should update a user', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            name: 'NewName',
            email: 'newEmail@gmail.com',
            password: 'NewPwd@NewPwd'
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(200)
        expect(responseUpdateUser.body.user.id).toBe(user.id)
        expect(responseUpdateUser.body.user.name).toBe(datasUpdate.name)
        expect(responseUpdateUser.body.user.email).toBe(datasUpdate.email)
        expect(responseUpdateUser.body.user).not.toHaveProperty('password')
        expect(responseUpdateUser.body.success).toBe('User updated with successfully!')
        
    })

    it('should update a partial datas for user [name]', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            name: 'NewName',
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(200)
        expect(responseUpdateUser.body.user.id).toBe(user.id)
        expect(responseUpdateUser.body.user.name).toBe(datasUpdate.name)
        expect(responseUpdateUser.body.user.email).toBe(user.email)
        expect(responseUpdateUser.body.user).not.toHaveProperty('password')
        expect(responseUpdateUser.body.success).toBe('User updated with successfully!')
        
    })

    it('should update a partial datas for user [email]', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            email: 'newEmail@gmail.com',
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(200)
        expect(responseUpdateUser.body.user.id).toBe(user.id)
        expect(responseUpdateUser.body.user.email).toBe(datasUpdate.email)
        expect(responseUpdateUser.body.user.name).toBe(user.name)
        expect(responseUpdateUser.body.user).not.toHaveProperty('password')
        expect(responseUpdateUser.body.success).toBe('User updated with successfully!')
        
    })

    it('should update a partial datas for user [password]', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            password: 'NewPwd@NewPwd'
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(200)
        expect(responseUpdateUser.body.user.id).toBe(user.id)
        expect(responseUpdateUser.body.user.email).toBe(user.email)
        expect(responseUpdateUser.body.user.name).toBe(user.name)
        expect(responseUpdateUser.body.user).not.toHaveProperty('password')
        expect(responseUpdateUser.body.success).toBe('User updated with successfully!')
        
    })

    it('should update a partial datas for user [name and email]', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            name: 'NewName',
            email: 'newEmail@gmail.com',
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(200)
        expect(responseUpdateUser.body.user.id).toBe(user.id)
        expect(responseUpdateUser.body.user.email).toBe(datasUpdate.email)
        expect(responseUpdateUser.body.user.name).toBe(datasUpdate.name)
        expect(responseUpdateUser.body.user).not.toHaveProperty('password')
        expect(responseUpdateUser.body.success).toBe('User updated with successfully!')
        
    })

    it('should update a partial datas for user [name and password]', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            name: 'NewName',
            password: 'NewPwd@NewPwd',
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(200)
        expect(responseUpdateUser.body.user.id).toBe(user.id)
        expect(responseUpdateUser.body.user.name).toBe(datasUpdate.name)
        expect(responseUpdateUser.body.user.email).toBe(user.email)
        expect(responseUpdateUser.body.user).not.toHaveProperty('password')
        expect(responseUpdateUser.body.success).toBe('User updated with successfully!')
        
    })

    it('should update a partial datas for user [email and password]', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            email: 'newEmail@gmail.com',
            password: 'NewPwd@NewPwd',
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(200)
        expect(responseUpdateUser.body.user.id).toBe(user.id)
        expect(responseUpdateUser.body.user.name).toBe(user.name)
        expect(responseUpdateUser.body.user.email).toBe(datasUpdate.email)
        expect(responseUpdateUser.body.user).not.toHaveProperty('password')
        expect(responseUpdateUser.body.success).toBe('User updated with successfully!')
        
    })

    it('should return an error when any data does not belong to the user', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {
            email: 'newEmail@gmail.com',
            any_filed: 'AnyValue',
            outherField: 'OutherValue'
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(400)
        expect(responseUpdateUser.body.user).toBeNull()
        expect(responseUpdateUser.body.success).toBeFalsy()
        expect(responseUpdateUser.body.errors).toBeTruthy()
        expect(responseUpdateUser.body.errors.length).toBe(1)
        expect(responseUpdateUser.body.errors![0]).toBe('Invalid datas!')
        
    })

    it('should return an error when datas is not provided', async () => {
        const { token, user } = await login()
    
        const datasUpdate = {}

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateUser.status).toBe(400)
        expect(responseUpdateUser.body.user).toBeNull()
        expect(responseUpdateUser.body.success).toBeFalsy()
        expect(responseUpdateUser.body.errors).toBeTruthy()
        expect(responseUpdateUser.body.errors.length).toBe(1)
        expect(responseUpdateUser.body.errors![0]).toBe('No datas sent!')
        
    })

    it('should return an error when new email is already being used', async () => {
        const userCreated = await createUser()
        
        const { token } = await login() 

        const datasUpdate = {
            name: 'any_name',
            email: userCreated.user.email
        }

        const responseUpdateUser = await request(app)
            .patch('/user')
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)        

        expect(responseUpdateUser.status).toBe(500)
        expect(responseUpdateUser.body.user).toBeNull()
        expect(responseUpdateUser.body.success).toBeFalsy()
        expect(responseUpdateUser.body.errors).toBeTruthy()
        expect(responseUpdateUser.body.errors.length).toBe(1)
        expect(responseUpdateUser.body.errors![0].toLowerCase()).toContain('unique constraint failed on the constraint')
        
    })
})