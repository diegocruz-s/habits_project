import { CreateHabitValid } from "../../../../tests/factories/Habit"
import { Habit } from "../../../entities/habit/Habit"
import { DeleteHabitController } from "./delete-habit"
import { IDeleteHabitRepository } from "./protocols"

const datasHabit = {
    id: 'any_idHabit'
}
const datasUser = {
    id: 'any_idUser'
}

const makeFakeRepositoryFailed = () => {
    class DeleteHabitFakeRepository implements IDeleteHabitRepository {
        private habits: Habit[] = [
            CreateHabitValid({
                habit: datasHabit,
                user: datasUser
            })
        ]

        async delete(habitId: string, userId: string): Promise<{ message: string }> {
            throw new Error('Error Repository!')
        }
    }

    const deleteHabitFakeRepository = new DeleteHabitFakeRepository()

    return {
        deleteHabitFakeRepository
    }
}

const makeControllerWithMocksFailed = () => {
    const { deleteHabitFakeRepository } = makeFakeRepositoryFailed()
    const deleteHabitController  = new DeleteHabitController(deleteHabitFakeRepository)

    return {
        deleteHabitController
    }
}

const makeFakeRepository = () => {
    class DeleteHabitFakeRepository implements IDeleteHabitRepository {
        private habits: Habit[] = [
            CreateHabitValid({
                habit: datasHabit,
                user: datasUser
            })
        ]

        async delete(habitId: string, userId: string): Promise<{ message: string }> {
            const findHabit = this.habits.find(habit => (
                habit.userId === userId &&
                habit.id === habitId
            ))

            if (!findHabit) throw new Error('Habit bot found!')

            const filterHabits = this.habits.filter(habit => (
                habit.id !== habitId &&
                habit.userId !== userId
            ))

            this.habits = filterHabits

            return {
                message: 'Habit deleted with success!'
            }
        }
    }

    const deleteHabitFakeRepository = new DeleteHabitFakeRepository()

    return {
        deleteHabitFakeRepository
    }
}

const makeControllerWithMocks = () => {
    const { deleteHabitFakeRepository } = makeFakeRepository()
    const deleteHabitController  = new DeleteHabitController(deleteHabitFakeRepository)

    return {
        deleteHabitController
    }
}

describe('Delete Habit', () => {
    it('should delete a habit', async () => {
        const { deleteHabitController } = makeControllerWithMocks()

        const { body, statusCode } = await deleteHabitController.handle({
            params: {
                userId: datasUser.id,
                habitId: datasHabit.id
            }
        })

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.message).toBe('Habit deleted with success!')
    })

    it('should return a error when params is not corrected [habitId]', async () => {
        const { deleteHabitController } = makeControllerWithMocks()

        const { body, statusCode } = await deleteHabitController.handle({
            params: {
                userId: datasUser.id,
            }
        })

        expect(statusCode).toBe(422)
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Params is not corrected!')
        expect(body.message).toBeNull()
    })

    it('should return a error when params is not corrected [userId]', async () => {
        const { deleteHabitController } = makeControllerWithMocks()

        const { body, statusCode } = await deleteHabitController.handle({
            params: {
                habitId: datasHabit.id
            }
        })

        expect(statusCode).toBe(422)
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Params is not corrected!')
        expect(body.message).toBeNull()
    })

    it('should return a error when repository return a error', async () => {
        const { deleteHabitController } = makeControllerWithMocksFailed()

        const { body, statusCode } = await deleteHabitController.handle({
            params: {
                userId: datasUser.id,
                habitId: datasHabit.id
            }
        })

        expect(statusCode).toBe(500)
        expect(body.errors?.length).toBe(1)
        expect(body.errors![0]).toBe('Error Repository!')
        expect(body.message).toBeNull()
    })
})