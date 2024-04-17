import { randomUUID } from "crypto"
import { Day } from "../../../entities/day/Day"
import { Habit } from "../../../entities/habit/Habit"
import { IUndoConcludeRepository } from "./protocols"
import { UndoConcludeController } from "./undo-conclude"
import { CreateHabitValid } from "../../../../tests/factories/Habit"
import { DayHabitConclude } from "../../../entities/dayHabitsConcludes/DayHabitConclude"

const date = new Date()
const datasHabit = {
    id: 'any_habitId',
    weekDays: [date.getDay()]
}
const datasUser = {
    id: 'any_userId'
}
const dayConclude = new Day(randomUUID(), date) 

const makeFakeRepository = () => {
    class UndoConcludeRepositoryTest implements IUndoConcludeRepository {
        private habits: Habit[] = []

        constructor () {
            const habit = CreateHabitValid({ habit: datasHabit, user: datasUser })
            new DayHabitConclude(randomUUID(), dayConclude, habit)

            this.habits.push(habit)
        }

        async undoConclude(habitId: string, userId: string, date: Date): Promise<Habit> {
            const findHabit = this.habits.find(habit => (
                habit.id === habitId &&
                habit.dayHabitsConcludes[0].day.date === date &&
                habit.userId === userId
            ))

            if(!findHabit) throw new Error('Habit not found!')

            findHabit.dayHabitsConcludes.shift()

            return findHabit

        }
    }

    const undoConcludeRepository = new UndoConcludeRepositoryTest()

    return {
        undoConcludeRepository
    }
}

const makeControllerWithMocks = () => {
    const { undoConcludeRepository } = makeFakeRepository()
    const undoConcludeController = new UndoConcludeController(undoConcludeRepository)

    return {
        undoConcludeController
    }
}

const makeFakeRepositoryFailed = () => {
    class UndoConcludeRepositoryTest implements IUndoConcludeRepository {
        async undoConclude(habitId: string, userId: string, date: Date): Promise<Habit> {
            throw new Error('Error Repository!')
        }
    }

    const undoConcludeRepository = new UndoConcludeRepositoryTest()

    return {
        undoConcludeRepository
    }
}

const makeControllerWithMocksFailed = () => {
    const { undoConcludeRepository } = makeFakeRepositoryFailed()
    const undoConcludeController = new UndoConcludeController(undoConcludeRepository)

    return {
        undoConcludeController
    }
}

describe('Undo Conclude Habit', () => {
    it('should undo conclude habit', async () => {
        const { undoConcludeController } = makeControllerWithMocks()

        const { body, statusCode } = await undoConcludeController.handle({
            params: {
                habitId: datasHabit.id,
                userId: datasUser.id,
                date
            }
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit undo conclude with success!')
        expect(body.habit?.id).toBe(datasHabit.id)
        expect(body.habit?.userId).toBe(datasUser.id)
    })

    it('should return a error when params is not correct [habitId]', async () => {
        const { undoConcludeController } = makeControllerWithMocks()

        const { body, statusCode } = await undoConcludeController.handle({
            params: {
                userId: datasUser.id,
                date
            }
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('habitId')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
    })

    it('should return a error when params is not correct [userId]', async () => {
        const { undoConcludeController } = makeControllerWithMocks()

        const { body, statusCode } = await undoConcludeController.handle({
            params: {
                habitId: datasHabit.id,
                date
            }
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('userId')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
    })

    it('should return a error when params is not correct [date]', async () => {
        const { undoConcludeController } = makeControllerWithMocks()

        const { body, statusCode } = await undoConcludeController.handle({
            params: {
                habitId: datasHabit.id,
                userId: datasUser.id,
            }
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('date')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
    })

    it('should return a error when date is not a date', async () => {
        const { undoConcludeController } = makeControllerWithMocks()

        const { body, statusCode } = await undoConcludeController.handle({
            params: {
                habitId: datasHabit.id,
                userId: datasUser.id,
                date: 'any_date'
            }
        })

        expect(statusCode).toBe(422)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toContain('date')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
    })

    it('should return a error when repository return a error', async () => {
        const { undoConcludeController } = makeControllerWithMocksFailed()

        const { body, statusCode } = await undoConcludeController.handle({
            params: {
                habitId: datasHabit.id,
                userId: datasUser.id,
                date
            }
        })

        expect(statusCode).toBe(500)
        expect(body.errors).toBeTruthy()
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Error Repository!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
    })
})