import { app } from "../.."
import { createHabit } from "../../../tests/createHabit/createHabit"
import request from 'supertest'

describe('[e2e] Update Habit', () => {

    it('should update a habit', async () => {
        const { habit, token, user } = await createHabit({})

        const datasUpdate = {
            numbersOfWeek: habit.numbersOfWeek + 1,
            weekDays: [3, 5, 6],
            title: 'Any_title'
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(200)
        expect(responseUpdateHabit.body.errors).toBeNull()
        expect(responseUpdateHabit.body.success).toBe('Habit updated with success!')
        expect(responseUpdateHabit.body.habit).toBeTruthy()
        expect(responseUpdateHabit.body.habit.id).toBe(habit.id)
        expect(responseUpdateHabit.body.habit.numbersOfWeek).toBe(datasUpdate.numbersOfWeek)
        expect(responseUpdateHabit.body.habit.title).toBe(datasUpdate.title)
        for(let i=0;i<datasUpdate.weekDays.length;i++) {
            expect(responseUpdateHabit.body.habit.weekDays[i].id).toBeTruthy()
            expect(responseUpdateHabit.body.habit.weekDays[i].habitId).toBe(habit.id)
            expect(responseUpdateHabit.body.habit.weekDays[i].weekDay).toBe(datasUpdate.weekDays[i])
        }
    })

    it('should return a error when habit is not found', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            numbersOfWeek: habit.numbersOfWeek + 1,
            weekDays: [3, 5, 6],
            title: 'Any_title'
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/any_habitId`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(500)
        expect(responseUpdateHabit.body.errors.length).toBe(1)
        expect(responseUpdateHabit.body.errors[0]).toBe('Habit not found!')
        expect(responseUpdateHabit.body.success).toBeFalsy()
        expect(responseUpdateHabit.body.habit).toBeNull()
        
    })

    it('should update a habit when partial datas is send [numbersOfWeek, weekDays]', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            numbersOfWeek: habit.numbersOfWeek + 1,
            weekDays: [3, 5, 6],
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(200)
        expect(responseUpdateHabit.body.errors).toBeNull()
        expect(responseUpdateHabit.body.success).toBe('Habit updated with success!')
        expect(responseUpdateHabit.body.habit).toBeTruthy()
        expect(responseUpdateHabit.body.habit.id).toBe(habit.id)
        expect(responseUpdateHabit.body.habit.numbersOfWeek).toBe(datasUpdate.numbersOfWeek)
        expect(responseUpdateHabit.body.habit.title).toBe(habit.title)
        for(let i=0;i<datasUpdate.weekDays.length;i++) {
            expect(responseUpdateHabit.body.habit.weekDays[i].id).toBeTruthy()
            expect(responseUpdateHabit.body.habit.weekDays[i].habitId).toBe(habit.id)
            expect(responseUpdateHabit.body.habit.weekDays[i].weekDay).toBe(datasUpdate.weekDays[i])
        }
    })

    it('should update a habit when partial datas is send [numbersOfWeek, title]', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            numbersOfWeek: habit.numbersOfWeek + 1,
            title: 'New_title_habit'
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(200)
        expect(responseUpdateHabit.body.errors).toBeNull()
        expect(responseUpdateHabit.body.success).toBe('Habit updated with success!')
        expect(responseUpdateHabit.body.habit).toBeTruthy()
        expect(responseUpdateHabit.body.habit.id).toBe(habit.id)
        expect(responseUpdateHabit.body.habit.numbersOfWeek).toBe(datasUpdate.numbersOfWeek)
        expect(responseUpdateHabit.body.habit.title).toBe(datasUpdate.title)
        for(let i=0;i<responseUpdateHabit.body.habit.weekDays.length;i++) {
            expect(responseUpdateHabit.body.habit.weekDays[i].id).toBeTruthy()
            expect(responseUpdateHabit.body.habit.weekDays[i].habitId).toBe(habit.id)
            expect(responseUpdateHabit.body.habit.weekDays[i].weekDay).toBe(habit.weekDays[i].weekDay)
        }
    })

    it('should update a habit when partial datas is send [weekDays, title]', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            weekDays: [2, 5, 6],
            title: 'New_title_habit'
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(200)
        expect(responseUpdateHabit.body.errors).toBeNull()
        expect(responseUpdateHabit.body.success).toBe('Habit updated with success!')
        expect(responseUpdateHabit.body.habit).toBeTruthy()
        expect(responseUpdateHabit.body.habit.id).toBe(habit.id)
        expect(responseUpdateHabit.body.habit.numbersOfWeek).toBe(habit.numbersOfWeek)
        expect(responseUpdateHabit.body.habit.title).toBe(datasUpdate.title)
        for(let i=0;i<datasUpdate.weekDays.length;i++) {
            expect(responseUpdateHabit.body.habit.weekDays[i].id).toBeTruthy()
            expect(responseUpdateHabit.body.habit.weekDays[i].habitId).toBe(habit.id)
            expect(responseUpdateHabit.body.habit.weekDays[i].weekDay).toBe(datasUpdate.weekDays[i])
        }
    })

    it('should update a habit when partial datas is send [weekDays]', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            weekDays: [2, 5, 6],
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(200)
        expect(responseUpdateHabit.body.errors).toBeNull()
        expect(responseUpdateHabit.body.success).toBe('Habit updated with success!')
        expect(responseUpdateHabit.body.habit).toBeTruthy()
        expect(responseUpdateHabit.body.habit.id).toBe(habit.id)
        expect(responseUpdateHabit.body.habit.numbersOfWeek).toBe(habit.numbersOfWeek)
        expect(responseUpdateHabit.body.habit.title).toBe(habit.title)
        for(let i=0;i<datasUpdate.weekDays.length;i++) {
            expect(responseUpdateHabit.body.habit.weekDays[i].id).toBeTruthy()
            expect(responseUpdateHabit.body.habit.weekDays[i].habitId).toBe(habit.id)
            expect(responseUpdateHabit.body.habit.weekDays[i].weekDay).toBe(datasUpdate.weekDays[i])
        }
    })

    it('should update a habit when partial datas is send [title]', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            title: 'New_habit_title'
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(200)
        expect(responseUpdateHabit.body.errors).toBeNull()
        expect(responseUpdateHabit.body.success).toBe('Habit updated with success!')
        expect(responseUpdateHabit.body.habit).toBeTruthy()
        expect(responseUpdateHabit.body.habit.id).toBe(habit.id)
        expect(responseUpdateHabit.body.habit.numbersOfWeek).toBe(habit.numbersOfWeek)
        expect(responseUpdateHabit.body.habit.title).toBe(datasUpdate.title)
        for(let i=0;i<responseUpdateHabit.body.habit.weekDays.length;i++) {
            expect(responseUpdateHabit.body.habit.weekDays[i].id).toBeTruthy()
            expect(responseUpdateHabit.body.habit.weekDays[i].habitId).toBe(habit.id)
            expect(responseUpdateHabit.body.habit.weekDays[i].weekDay).toBe(habit.weekDays[i].weekDay)
        }
    })

    it('should update a habit when partial datas is send [numbersOfWeek]', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            numbersOfWeek: habit.numbersOfWeek + 2
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(200)
        expect(responseUpdateHabit.body.errors).toBeNull()
        expect(responseUpdateHabit.body.success).toBe('Habit updated with success!')
        expect(responseUpdateHabit.body.habit).toBeTruthy()
        expect(responseUpdateHabit.body.habit.id).toBe(habit.id)
        expect(responseUpdateHabit.body.habit.numbersOfWeek).toBe(datasUpdate.numbersOfWeek)
        expect(responseUpdateHabit.body.habit.title).toBe(habit.title)
        for(let i=0;i<responseUpdateHabit.body.habit.weekDays.length;i++) {
            expect(responseUpdateHabit.body.habit.weekDays[i].id).toBeTruthy()
            expect(responseUpdateHabit.body.habit.weekDays[i].habitId).toBe(habit.id)
            expect(responseUpdateHabit.body.habit.weekDays[i].weekDay).toBe(habit.weekDays[i].weekDay)
        }
    })

    it('should return an error when numbersOfWeek is less than the current', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            numbersOfWeek: habit.numbersOfWeek - 1,
            weekDays: [3, 5, 6],
            title: 'Any_title'
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(422)
        expect(responseUpdateHabit.body.errors.length).toBe(1)
        expect(responseUpdateHabit.body.errors[0]).toBe('You can only update the habit for more weeks!')
        expect(responseUpdateHabit.body.success).toBeFalsy()
        expect(responseUpdateHabit.body.habit).toBeNull()
        
    })

    it('should return an error when datas not send', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {}

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(422)
        expect(responseUpdateHabit.body.errors.length).toBe(1)
        expect(responseUpdateHabit.body.errors[0]).toBe('No datas sent!')
        expect(responseUpdateHabit.body.success).toBeFalsy()
        expect(responseUpdateHabit.body.habit).toBeNull()
        
    })

    it('should return an error when invalid properties are passed', async () => {
        const { habit, token } = await createHabit({})

        const datasUpdate = {
            numbersOfWeek: habit.numbersOfWeek - 1,
            weekDays: [3, 5, 6],
            title: 'Any_title',
            anyField: 'any_value'
        }

        const responseUpdateHabit = await request(app)
            .patch(`/habit/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(datasUpdate)

        expect(responseUpdateHabit.status).toBe(422)
        expect(responseUpdateHabit.body.errors.length).toBe(1)
        expect(responseUpdateHabit.body.errors[0]).toBe('Invalid datas!')
        expect(responseUpdateHabit.body.success).toBeFalsy()
        expect(responseUpdateHabit.body.habit).toBeNull()
        
    })
})
