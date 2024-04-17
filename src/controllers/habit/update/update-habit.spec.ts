import { randomUUID } from "crypto"

import { CreateHabitValid } from "../../../../tests/factories/Habit"
import { Habit } from "../../../entities/habit/Habit"
import { HabitWeekDay } from "../../../entities/weekDays/HabitWeekDay"
import { IDatasHabitUpdateRepository, IUpdateHabitRepository } from "./protocols"
import { UpdateHabitController } from "./update-habit"

const datasHabit = {
    id: 'any_habitId',
    numbersOfWeek: 3,
    weekDays: [1,2,3],
    title: 'Initial_title'
}
const datasUser = {
    id: 'any_userId'
}

const makeFakeRepository = () => {
    class UpdateHabitRepository implements IUpdateHabitRepository {
        private habits: Habit[] = [
            CreateHabitValid({ habit: datasHabit, user: datasUser }),
            CreateHabitValid()
        ]

        async findHabit(habitId: string, userId: string): Promise<Habit> {
            const findHabit = this.habits.find(
                habit => habit.id === habitId && habit.userId === userId
            )
            if(!findHabit) throw new Error('Habit not found!')
            console.log('findHabit: ', findHabit)

            return findHabit
        }

        async update(habitId: string, userId: string, datas: IDatasHabitUpdateRepository): Promise<Habit> {
            const newHabits = this.habits.map(habit => {
                if(habit.id === habitId && habit.userId === userId) {
                    return { ...habit, ...datas }
                }
                return habit
            })
            this.habits = newHabits as Habit[]
            console.log('allHabits: ', this.habits)
            

            const findHabit = await this.findHabit(habitId, userId)

            return findHabit
            
        }
    }

    const updateHabitRepository = new UpdateHabitRepository()

    return {
        updateHabitRepository
    }
}

const makeControllerWithMocks = () => {
    const { updateHabitRepository } = makeFakeRepository()
    const updatedHabitController = new UpdateHabitController(updateHabitRepository)

    return {
        updatedHabitController
    }
}


const makeFakeRepositoryFailed = () => {
    class UpdateHabitRepository implements IUpdateHabitRepository {

        async findHabit(habitId: string, userId: string): Promise<Habit> {
            throw new Error('Error repository!')
        }

        async update(habitId: string, userId: string, datas: IDatasHabitUpdateRepository): Promise<Habit> {
            throw new Error('Error repository!')
        }
    }

    const updateHabitRepository = new UpdateHabitRepository()

    return {
        updateHabitRepository
    }
}

const makeControllerWithMocksFailed = () => {
    const { updateHabitRepository } = makeFakeRepositoryFailed()
    const updatedHabitController = new UpdateHabitController(updateHabitRepository)

    return {
        updatedHabitController
    }
}

describe('Update Habit Controller', () => {
    it('should update a habit', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: 5,
            title: 'Any_New_Title',
            weekDays: [0, 2, 5]
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit updated with success!')
        expect(body.habit).toBeTruthy()
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
        expect(body.habit?.numbersOfWeek).toBe(httpBody.numbersOfWeek)
        expect(body.habit?.title).toBe(httpBody.title)
        for(let i=0;i<httpBody.weekDays.length;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(httpBody.weekDays[i])
        } 
    })

    it('should update a habit when send partial datas [numbersOfweek, title]', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: 5,
            title: 'Any_New_Title',
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit updated with success!')
        expect(body.habit).toBeTruthy()
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
        expect(body.habit?.numbersOfWeek).toBe(httpBody.numbersOfWeek)
        expect(body.habit?.title).toBe(httpBody.title)
        for(let i=0;i<body.habit!.weekDays.length;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(datasHabit.weekDays[i])
        } 
    })

    it('should update a habit when send partial datas [numbersOfweek, weekDays]', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: 5,
            weekDays: [0, 2, 5]
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit updated with success!')
        expect(body.habit).toBeTruthy()
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
        expect(body.habit?.numbersOfWeek).toBe(httpBody.numbersOfWeek)
        for(let i=0;i<httpBody.weekDays.length;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(httpBody.weekDays[i])
        } 
        expect(body.habit?.title).toBe(datasHabit.title)

    })

    it('should update a habit when send partial datas [title, weekDays]', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            title: 'Any_New_Title',
            weekDays: [0, 2, 5]
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit updated with success!')
        expect(body.habit).toBeTruthy()
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
        expect(body.habit?.title).toBe(httpBody.title)
        for(let i=0;i<httpBody.weekDays.length;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(httpBody.weekDays[i])
        } 
        expect(body.habit?.numbersOfWeek).toBe(datasHabit.numbersOfWeek)

    })

    it('should update a habit when send partial datas [title]', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            title: 'Any_New_Title',
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit updated with success!')
        expect(body.habit).toBeTruthy()
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
        expect(body.habit?.title).toBe(httpBody.title)
        for(let i=0;i<body.habit!.weekDays.length;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(datasHabit.weekDays[i])
        } 
        expect(body.habit?.numbersOfWeek).toBe(datasHabit.numbersOfWeek)

    })

    it('should update a habit when send partial datas [numbersOfWeek]', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: 5,
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit updated with success!')
        expect(body.habit).toBeTruthy()
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
        expect(body.habit?.title).toBe(datasHabit.title)
        for(let i=0;i<body.habit!.weekDays.length;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(datasHabit.weekDays[i])
        } 
        expect(body.habit?.numbersOfWeek).toBe(httpBody.numbersOfWeek)

    })

    it('should update a habit when send partial datas [weekDays]', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            weekDays: [2, 3]
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit updated with success!')
        expect(body.habit).toBeTruthy()
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
        expect(body.habit?.title).toBe(datasHabit.title)
        for(let i=0;i<httpBody.weekDays.length;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(httpBody.weekDays[i])
        } 
        expect(body.habit?.numbersOfWeek).toBe(datasHabit.numbersOfWeek)

    })

    it('should return an error when invalid properties are passed', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: 5,
            title: 'Any_New_Title',
            weekDays: [0, 2, 5],
            any_field: 'Any_value'
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Invalid datas!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
    })

    it('should return an error when datas not send', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {}

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('No datas sent!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()

    })

    it('should return an error when numbersOfWeek is less than the current', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: datasHabit.numbersOfWeek - 1,
            title: 'Any_New_Title',
            weekDays: [0, 2, 5],
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('You can only update the habit for more weeks!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()

    })

    it('should return an error when habitId is not provided', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: 5,
            title: 'Any_New_Title',
            weekDays: [0, 2, 5],
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Params is not corrected!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()

    })

    it('should return an error when userId is not provided', async () => {
        const { updatedHabitController } = makeControllerWithMocks()

        const httpParams = {
            habitId: datasHabit.id
        }

        const httpBody = {
            numbersOfWeek: 5,
            title: 'Any_New_Title',
            weekDays: [0, 2, 5],
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Params is not corrected!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()

    })

    it('should return an error when repository return a error', async () => {
        const { updatedHabitController } = makeControllerWithMocksFailed()

        const httpParams = {
            habitId: datasHabit.id,
            userId: datasUser.id
        }

        const httpBody = {
            numbersOfWeek: 5,
            title: 'Any_New_Title',
            weekDays: [0, 2, 5],
        }

        const { body, statusCode } = await updatedHabitController.handle({
            params: httpParams,
            body: httpBody
        })

        expect(statusCode).toBe(500)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Error repository!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()

    })
}) 
