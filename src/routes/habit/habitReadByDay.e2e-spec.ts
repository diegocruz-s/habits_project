import request from 'supertest'

import { app } from "../.."
import { createHabit } from "../../../tests/createHabit/createHabit"
import { login } from "../../../tests/login/login"
import { User } from "../../entities/user/User"
import { prisma } from '../../database/prisma-client'

let userLogin: User
let tokenLogin: string

const prepareHabitsForRead = async () => {
    const { user, token } = await login()
    userLogin = user
    tokenLogin = token

    for(let i=0;i<=4;i++) {
        const response = await createHabit({
            userDatas: user,
            tokenData: token,
            numbersOfWeek: i === 4 ? 1 : 3  
        })

        if (i % 2 !== 0) {
            const concludeData = new Date()
            const { statusCode, body } = await request(app)
                .post(`/habit/${response.habit.id}/${concludeData}`)
                .set('Authorization', `Bearer ${tokenLogin}`)
        
            expect(statusCode).toBe(200)
            expect(body.habitConclude).toBeTruthy()
            expect(body.habitConclude?.id).toBeTruthy()
            expect(body.habitConclude?.error).toBeFalsy()
            expect(body.habitConclude?.habit.id).toBe(response.habit.id)
            expect(body.habitConclude?.habit.userId).toBe(user.id)
            expect(body.success).toBe('Habit conclude with success!')
            expect(body.errors).toBeNull()
        }
    }
}

describe('[e2e] Read Habits By Day', () => {
    beforeEach(async () => {
        await prisma.dayHabitComplete.deleteMany()
        await prisma.weekDay.deleteMany()
        await prisma.habit.deleteMany()
        await prisma.user.deleteMany()
        await prepareHabitsForRead()
    })

    it('should returns a habit by day', async () => {
        const date = new Date()
        
        const responseRead = await request(app)
            .get(`/habit/${date}`)
            .set('Authorization', `Bearer ${tokenLogin}`)
        
        expect(responseRead.status).toBe(200)
        expect(responseRead.body.habits).toBeTruthy()
        expect(responseRead.body.habits.completeHabits.length).toBe(2)
        expect(responseRead.body.habits.possibleHabits.length).toBe(3)
        expect(responseRead.body.errors).toBeNull()
    })

    it('should not return expired habits', async () => {
        const date = new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000)

        const responseRead = await request(app)
            .get(`/habit/${date}`)
            .set('Authorization', `Bearer ${tokenLogin}`)
        
        expect(responseRead.status).toBe(200)
        expect(responseRead.body.habits).toBeTruthy()
        expect(responseRead.body.habits.completeHabits.length).toBe(0)
        expect(responseRead.body.habits.possibleHabits.length).toBe(4)
        expect(responseRead.body.errors).toBeNull()
    })

    it('should not return expired habits', async () => {
        const date = new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)

        const responseRead = await request(app)
            .get(`/habit/${date}`)
            .set('Authorization', `Bearer ${tokenLogin}`)
        
        expect(responseRead.status).toBe(200)
        expect(responseRead.body.habits).toBeTruthy()
        expect(responseRead.body.habits.completeHabits.length).toBe(0)
        expect(responseRead.body.habits.possibleHabits.length).toBe(0)
        expect(responseRead.body.errors).toBeNull()
    })

    it('should return a error when date is not type Date', async () => {
        const date = 'any_date'

        const responseRead = await request(app)
            .get(`/habit/${date}`)
            .set('Authorization', `Bearer ${tokenLogin}`)
        
        expect(responseRead.status).toBe(400)
        expect(responseRead.body.habits).toBeNull()
        expect(responseRead.body.errors).toBeTruthy()
        expect(responseRead.body.errors.length).toBe(1)
        expect(responseRead.body.errors![0]).toBe('date: Invalid date')
    })
})
