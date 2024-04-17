import request from 'supertest'

import { app } from "../.."
import { createHabit } from "../../../tests/createHabit/createHabit"
import { login } from "../../../tests/login/login"
import { prisma } from "../../database/prisma-client"

describe('[e2e] Conclude Habit', () => {
    beforeEach(async () => {
        await prisma.dayHabitComplete.deleteMany()
        await prisma.weekDay.deleteMany()
        await prisma.habit.deleteMany()
        await prisma.user.deleteMany()
    })
    
    it('should conclude a habit', async () => {
        const { habit, token, user } = await createHabit({})
        const concludeData = new Date()

        const { statusCode, body } = await request(app)
            .post(`/habit/${habit.id}/${concludeData}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(statusCode).toBe(200)
        expect(body.habitConclude).toBeTruthy()
        expect(body.habitConclude?.id).toBeTruthy()
        expect(body.habitConclude?.error).toBeFalsy()
        expect(body.habitConclude?.habit.id).toBe(habit.id)
        expect(body.habitConclude?.habit.userId).toBe(user.id)
        const date = new Date(body.habitConclude?.day.date)
        expect(date.getFullYear()).toBe(concludeData.getFullYear())
        expect(date.getMonth()).toBe(concludeData.getMonth())
        expect(date.getDate()).toBe(concludeData.getDate())
        expect(body.success).toBe('Habit conclude with success!')
        expect(body.errors).toBeNull()

    })

    it('should return a error when habit is not found', async () => {
        const { token } = await createHabit({})
        const concludeData = new Date()

        const { statusCode, body } = await request(app)
            .post(`/habit/any_habitId/${concludeData}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(statusCode).toBe(500)
        expect(body.habitConclude).toBeNull()
        expect(body.success).toBeFalsy()
        expect(body.errors.length).toBe(1)
        expect(body.errors![0]).toBe('Habit not found!')
    })

    it('should return a error when habit conclude again', async () => {
        const { habit, token, user } = await createHabit({})
        const concludeData = new Date()

        const responseConclude = await request(app)
            .post(`/habit/${habit.id}/${concludeData}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(responseConclude.statusCode).toBe(200)
        expect(responseConclude.body.habitConclude).toBeTruthy()
        expect(responseConclude.body.habitConclude?.id).toBeTruthy()
        expect(responseConclude.body.habitConclude?.habit.id).toBe(habit.id)
        expect(responseConclude.body.habitConclude?.habit.userId).toBe(user.id)
        expect(responseConclude.body.success).toBe('Habit conclude with success!')
        expect(responseConclude.body.errors).toBeNull()

        const responseConcludeAgain = await request(app)
            .post(`/habit/${habit.id}/${concludeData}`)
            .set('Authorization', `Bearer ${token}`)

        expect(responseConcludeAgain.statusCode).toBe(500)
        expect(responseConcludeAgain.body.habitConclude).toBeNull()
        expect(responseConcludeAgain.body.success).toBeFalsy()
        expect(responseConcludeAgain.body.errors.length).toBe(1)
        expect(responseConcludeAgain.body.errors![0]).toBe('Habit already concluded on this day!')
    })

    it('should return a error when date is not valid', async () => {
        const { token, habit } = await createHabit({})
        const concludeData = 'any_value_date'

        const { statusCode, body } = await request(app)
            .post(`/habit/${habit.id}/${concludeData}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(statusCode).toBe(422)
        expect(body.habitConclude).toBeNull()
        expect(body.success).toBeFalsy()
        expect(body.errors.length).toBe(1)
        expect(body.errors![0]).toContain('date')
    })

})