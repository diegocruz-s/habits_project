import request from 'supertest'

import { app } from '../..'
import { createHabit } from "../../../tests/createHabit/createHabit"

describe('[e2e] Undo Conclude Habit', () => {
    it('should undo conclude a habit', async () => {
        const { habit, token, user } = await createHabit({})

        const date = new Date()
        const concludeHabitResponse = await request(app)
            .post(`/habit/${habit.id}/${date}`)
            .set('Authorization', `Bearer ${token}`)

        expect(concludeHabitResponse.statusCode).toBe(200)
        expect(concludeHabitResponse.body.habitConclude).toBeTruthy()
        expect(concludeHabitResponse.body.habitConclude?.id).toBeTruthy()
        expect(concludeHabitResponse.body.habitConclude?.error).toBeFalsy()
        expect(concludeHabitResponse.body.habitConclude?.habit.id).toBe(habit.id)
        expect(concludeHabitResponse.body.habitConclude?.habit.userId).toBe(user.id)
        expect(concludeHabitResponse.body.success).toBe('Habit conclude with success!')
        expect(concludeHabitResponse.body.errors).toBeNull()
    
        const undoConcludeHabit = await request(app)
            .post(`/habit/undo/${habit.id}/${date}`)
            .set('Authorization', `Bearer ${token}`)

        expect(undoConcludeHabit.statusCode).toBe(200)
        expect(undoConcludeHabit.body.habit).toBeTruthy()
        expect(undoConcludeHabit.body.habit.id).toBe(habit.id)
        expect(undoConcludeHabit.body.habit.userId).toBe(user.id)
        expect(undoConcludeHabit.body.habit.dayHabitsConcludes.length).toBe(0)
        expect(undoConcludeHabit.body.errors).toBeNull()
        expect(undoConcludeHabit.body.success).toBe('Habit undo conclude with success!')
    })

    it('should return a error when habit is not conclude yet', async () => {
        const { habit, token, user } = await createHabit({})

        const date = new Date()
    
        const undoConcludeHabit = await request(app)
            .post(`/habit/undo/${habit.id}/${date}`)
            .set('Authorization', `Bearer ${token}`)

        expect(undoConcludeHabit.statusCode).toBe(500)
        expect(undoConcludeHabit.body.habit).toBeNull()
        expect(undoConcludeHabit.body.errors).toBeTruthy()
        expect(undoConcludeHabit.body.errors![0]).toBe('Habit not yet completed!')
        expect(undoConcludeHabit.body.success).toBeFalsy()
    })

    it('should return a error when params is not correct [habitId]', async () => {
        const { habit, token, user } = await createHabit({})

        const date = new Date()
    
        const undoConcludeHabit = await request(app)
            .post(`/habit/undo/any_habitId/${date}`)
            .set('Authorization', `Bearer ${token}`)

        expect(undoConcludeHabit.statusCode).toBe(500)
        expect(undoConcludeHabit.body.habit).toBeNull()
        expect(undoConcludeHabit.body.errors).toBeTruthy()
        expect(undoConcludeHabit.body.errors![0]).toBe('Habit not yet completed!')
        expect(undoConcludeHabit.body.success).toBeFalsy()
    })

    it('should return a error when params is not correct [date]', async () => {
        const { habit, token, user } = await createHabit({})

        const date = new Date()
    
        const undoConcludeHabit = await request(app)
            .post(`/habit/undo/${habit.id}/any_date`)
            .set('Authorization', `Bearer ${token}`)

        expect(undoConcludeHabit.statusCode).toBe(422)
        expect(undoConcludeHabit.body.habit).toBeNull()
        expect(undoConcludeHabit.body.errors).toBeTruthy()
        expect(undoConcludeHabit.body.errors![0]).toContain('date')
        expect(undoConcludeHabit.body.success).toBeFalsy()
    })
})