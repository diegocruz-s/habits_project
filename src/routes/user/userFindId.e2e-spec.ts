import { app } from "../.."
import { login } from "../../../tests/login/login"
import request from 'supertest'

describe('[e2e] Find User', () => {
    it('should return a user', async () => {
        const { token, user } = await login()

        const responseFindUser = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${token}`)
    
        expect(responseFindUser.status).toBe(200)
        expect(responseFindUser.body.errors).toBeNull()
        expect(responseFindUser.body.user).toBeTruthy()
        expect(responseFindUser.body.user.id).toBe(user.id)
        expect(responseFindUser.body.user.name).toBe(user.name)
        expect(responseFindUser.body.user.email).toBe(user.email)
        expect(responseFindUser.body.user.password).toBe(user.password)
    })
})