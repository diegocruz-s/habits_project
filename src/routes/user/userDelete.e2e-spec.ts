import { app } from "../.."
import { login } from "../../../tests/login/login"
import request from 'supertest'

describe('[e2e] Delete User', () => {
    it('should delete user', async () => {
        const { token } = await login()

        const responseDeleteUser = await request(app)
            .delete('/user')
            .set('Authorization', `Bearer ${token}`)

        expect(responseDeleteUser.status).toBe(200)
        expect(responseDeleteUser.body.errors).toBeNull()
        expect(responseDeleteUser.body.success).toBe('User deleted with success!')

    })
})