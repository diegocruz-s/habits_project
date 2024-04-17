import request from 'supertest'

import { app } from '../..'
import { login } from '../../../tests/login/login'
import { prisma } from "../../database/prisma-client"

describe('[e2e] Create Habit', () => {
    beforeEach(async () => {
        await prisma.weekDay.deleteMany()
        await prisma.habit.deleteMany()
        await prisma.user.deleteMany()
    })

    it('should create a habit', async () => {
        const { token } = await login()

        const datasHabit = {
            title: 'Test habit create',
            numbersOfWeek: 3,
            weekDays: [1, 3, 5]
        }
        const createHabitResponse = await request(app)
            .post('/habit')
            .set('Authorization', `Bearer ${token}`)
            .send(datasHabit)         
        
        expect(createHabitResponse.status).toBe(201)
        expect(createHabitResponse.body.habit.id).toBeTruthy()
        expect(createHabitResponse.body.habit.title).toBe(datasHabit.title)
        expect(createHabitResponse.body.habit.numbersOfWeek).toBe(datasHabit.numbersOfWeek)
        for(let i=0;i<datasHabit.weekDays.length;i++) {
            expect(createHabitResponse.body.habit.weekDays[i].id).toBeTruthy()
            expect(createHabitResponse.body.habit.weekDays[i].habitId).toBe(createHabitResponse.body.habit.id)
            expect(datasHabit.weekDays[i]).toBe(createHabitResponse.body.habit.weekDays[i].weekDay)
        }
        expect(createHabitResponse.body.success).toBeTruthy()
        expect(createHabitResponse.body.errors).toBeNull()
    })

    it('should return a error when datas is not provided', async () => {
        const { token } = await login()

        const datasHabit = {}
        const createHabitResponse = await request(app)
            .post('/habit')
            .set('Authorization', `Bearer ${token}`)
            .send(datasHabit)

        expect(createHabitResponse.status).toBe(400)
        expect(createHabitResponse.body.success).toBeFalsy()
        expect(createHabitResponse.body.errors).toBeTruthy()
    })

    it('should return a error when datas is not exists', async () => {
        const { token } = await login()

        const createHabitResponse = await request(app)
            .post('/habit')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(createHabitResponse.status).toBe(400)
        expect(createHabitResponse.body.success).toBeFalsy()
        expect(createHabitResponse.body.errors).toBeTruthy()
    })

    it('should return a error when any value in weekDay to be < 0', async () => {
        const { token } = await login()

        const datasHabit = {
            title: 'Test habit create',
            numbersOfWeek: 3,
            weekDays: [1, -3, 5]
        }
        const createHabitResponse = await request(app)
            .post('/habit')
            .set('Authorization', `Bearer ${token}`)
            .send(datasHabit)
            
        expect(createHabitResponse.status).toBe(500)
        expect(createHabitResponse.body.success).toBeFalsy()
        expect(createHabitResponse.body.errors).toBeTruthy()
        expect(createHabitResponse.body.errors[0]).toContain('Week day nonexistent!')
    })

    it('should return a error when any value in weekDay to be > 6', async () => {
        const { token } = await login()

        const datasHabit = {
            title: 'Test habit create',
            numbersOfWeek: 3,
            weekDays: [1, 3, 7]
        }
        const createHabitResponse = await request(app)
            .post('/habit')
            .set('Authorization', `Bearer ${token}`)
            .send(datasHabit)
            
        expect(createHabitResponse.status).toBe(500)
        expect(createHabitResponse.body.success).toBeFalsy()
        expect(createHabitResponse.body.errors).toBeTruthy()
        expect(createHabitResponse.body.errors[0]).toContain('Week day nonexistent!')
    })

    it('should return a error when numbersOfWeek to be < 0', async () => {
        const { token } = await login()

        const datasHabit = {
            title: 'Test habit create',
            numbersOfWeek: -2,
            weekDays: [1, 3, 6]
        }
        const createHabitResponse = await request(app)
            .post('/habit')
            .set('Authorization', `Bearer ${token}`)
            .send(datasHabit)
            
        expect(createHabitResponse.status).toBe(400)
        expect(createHabitResponse.body.success).toBeFalsy()
        expect(createHabitResponse.body.errors).toBeTruthy()
        expect(createHabitResponse.body.errors[0]).toBe('Value numbersOfWeek must be a positive!')
    })
    
})
