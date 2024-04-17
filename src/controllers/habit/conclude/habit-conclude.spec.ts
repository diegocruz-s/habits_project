import { randomUUID } from "crypto"
import { CreateHabitValid } from "../../../../tests/factories/Habit"
import { Day } from "../../../entities/day/Day"
import { DayHabitConclude } from "../../../entities/dayHabitsConcludes/DayHabitConclude"
import { Habit } from "../../../entities/habit/Habit"
import { HabitConcludeController } from "./habit-conclude"
import { IConcludeHabitRepository } from "./protocols"

const userDatas = {
    id: 'user_test_id'
}

const habitDatas = {
    id: 'habit_test_id'
}

const makeFakeRepositoryFailed = () => {
    class ConcludeHabitRepository implements IConcludeHabitRepository {

        async conclude(habitId: string, userId: string, day: Day): Promise<DayHabitConclude> {
            throw new Error('Error Repository!') 
        }
    }

    const concludeHabitRepository = new ConcludeHabitRepository()

    return {
        concludeHabitRepository
    }
}

const makeControllerWithMocksFailed = () => {
    const { concludeHabitRepository } = makeFakeRepositoryFailed()
    const habitConcludeController = new HabitConcludeController(concludeHabitRepository)

    return {
        habitConcludeController,
        concludeHabitRepository
    }
}

const makeFakeRepository = () => {
    class ConcludeHabitRepository implements IConcludeHabitRepository {
        private habits: Habit[] = [
            CreateHabitValid({ habit: habitDatas, user: userDatas })
        ]

        async conclude(habitId: string, userId: string, day: Day): Promise<DayHabitConclude> {
            const findHabit = this.habits.find(habit => (
                habit.id === habitId &&
                userId === userId
            ))
            if(!findHabit) throw new Error('Habit not found!')

            const dayHabitConclude = new DayHabitConclude(randomUUID(), day, findHabit)
                
            return dayHabitConclude    
        }
    }

    const concludeHabitRepository = new ConcludeHabitRepository()

    return {
        concludeHabitRepository
    }
}

const makeControllerWithMocks = () => {
    const { concludeHabitRepository } = makeFakeRepository()
    const habitConcludeController = new HabitConcludeController(concludeHabitRepository)

    return {
        habitConcludeController,
        concludeHabitRepository
    }
}

describe('Conclude Habit', () => {
    it('should conclude a habit', async () => {
        const { habitConcludeController } = makeControllerWithMocks()
        const concludeData = new Date()

        const { statusCode, body } = await habitConcludeController.handle({
            params: {
                habitId: habitDatas.id,
                userId: userDatas.id,
                date: concludeData
            } 
        })
        

        expect(statusCode).toBe(200)
        expect(body.habitConclude).toBeTruthy()
        expect(body.habitConclude?.id).toBeTruthy()
        expect(body.habitConclude?.error).toBeFalsy()
        expect(body.habitConclude?.habit.id).toBe(habitDatas.id)
        expect(body.habitConclude?.day.date).toBe(concludeData)
        expect(body.habitConclude?.habit.userId).toBe(userDatas.id)

    })

    it('should return a error when datas partials is send [no habitId]', async () => {
        const { habitConcludeController } = makeControllerWithMocks()
        const concludeData = new Date()

        const { statusCode, body } = await habitConcludeController.handle({
            params: {
                userId: userDatas.id,
                date: concludeData
            } 
        })
        
        expect(statusCode).toBe(422)
        expect(body.habitConclude).toBeNull()
        expect(body.success).toBeFalsy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('habitId')

    })

    it('should return a error when datas partials is send [no userId]', async () => {
        const { habitConcludeController } = makeControllerWithMocks()
        const concludeData = new Date()

        const { statusCode, body } = await habitConcludeController.handle({
            params: {
                habitId: habitDatas.id,
                date: concludeData
            } 
        })
        
        expect(statusCode).toBe(422)
        expect(body.habitConclude).toBeNull()
        expect(body.success).toBeFalsy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('userId')

    })

    it('should return a error when datas partials is send [no date]', async () => {
        const { habitConcludeController } = makeControllerWithMocks()

        const { statusCode, body } = await habitConcludeController.handle({
            params: {
                habitId: habitDatas.id,
                userId: userDatas.id,
            } 
        })
        
        expect(statusCode).toBe(422)
        expect(body.habitConclude).toBeNull()
        expect(body.success).toBeFalsy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('date')

    })

    it('should return a error when repository return a error', async () => {
        const { habitConcludeController } = makeControllerWithMocksFailed()
        const concludeData = new Date()

        const { statusCode, body } = await habitConcludeController.handle({
            params: {
                habitId: habitDatas.id,
                userId: userDatas.id,
                date: concludeData
            } 
        })
        
        expect(statusCode).toBe(500)
        expect(body.habitConclude).toBeNull()
        expect(body.success).toBeFalsy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Error Repository!')

    })
})