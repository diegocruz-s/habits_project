import { app } from "../.."
import { createHabit } from "../../../tests/createHabit/createHabit"
import request from 'supertest'

describe('[e2e] Delete Habit', () => {
    it('should delete a habit', async () => {
        const { habit, token } = await createHabit({})

        const response = await request(app)
            .delete(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.errors).toBeNull()
        expect(response.body.message).toBe('Habit deleted with success!')
    })

    it('should return a error when habit not found', async () => {
        const { token } = await createHabit({})

        const response = await request(app)
            .delete(`/habit/any_habitId`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(500)
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors![0]).toBe('Habit not found!')
        expect(response.body.message).toBeNull()
    })

})
