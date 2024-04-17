import { CreateUserValid } from "../../../../tests/factories/User"
import { Habit } from '../../../entities/habit/Habit'
import { CreateHabitController } from "./create-habit"
import { ICreateHabitRepository } from "./protocols"

const makeFakeRepositoryFailed = () => {
    const createHabitRepository: ICreateHabitRepository = {
        async create(habit: Habit) {
            throw new Error('Habit not created!')
        },
    }

    return {
        createHabitRepository
    }

}

const makeFakeRepository = () => {
    const createHabitRepository: ICreateHabitRepository = {
        async create(habit: Habit) {
            return habit
        },
    }

    return {
        createHabitRepository
    }

}

const makeControlleWithMocks = () => {
    const { createHabitRepository } = makeFakeRepository() 

    const createHabitController = new CreateHabitController(createHabitRepository)

    return {
        createHabitController,
        createHabitRepository
    }

}

const makeControlleWithMocksFailed = () => {
    const { createHabitRepository } = makeFakeRepositoryFailed() 

    const createHabitController = new CreateHabitController(createHabitRepository)

    return {
        createHabitController,
        createHabitRepository
    }

}

describe('Create Habit' , () => {
    it('should create a habit', async () => {
        const { createHabitController } = makeControlleWithMocks()
        const user = CreateUserValid({})

        const httpBody = {
            title: 'Any_Title',
            numbersOfWeek: 3,
            weekDays: [2, 4, 6],
        }

        const { body, statusCode } = await createHabitController.handle({
            body: httpBody,
            params: {
                userId: user.id
            }
        })                

        expect(statusCode).toBe(201)
        expect(body.errors).toBeNull()
        expect(body.success).toBe('Habit created with successfully!')
        expect(body.habit).toHaveProperty('id')
        expect(body.habit?.title).toBe(httpBody.title)
        expect(body.habit?.createdAt).not.toBe(new Date(Date.now() - 5 * 60 * 1000)) // 10 minutos antes
        expect(body.habit?.createdAt).not.toBe(new Date(Date.now() + 5 * 60 * 1000)) // 10 minutos depois
        expect(body.habit?.numbersOfWeek).toBe(httpBody.numbersOfWeek)
        expect(body.habit?.weekDays.length).toBe(3)
        for(let i=0;i<3;i++) {
            expect(body.habit?.weekDays[i].weekDay).toBe(httpBody.weekDays[i])
            expect(body.habit?.weekDays[i].habitId).toBe(body.habit?.id)
        }
        expect(body.habit?.userId).toBe(user.id)
    })

    it('should return a error when datas is not provided', async () => {
        const { createHabitController } = makeControlleWithMocks()

        const { body, statusCode } = await createHabitController.handle({})        

        expect(statusCode).toBe(400)
        expect(body.errors).not.toBeNull()
        expect(body.errors![0]).toContain('userId')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
        
    })

    it('should return a error when body is not provided', async () => {
        const { createHabitController } = makeControlleWithMocks()
        const user = CreateUserValid({})

        const { body, statusCode } = await createHabitController.handle({
            params: {
                userId: user.id
            }
        })        

        expect(statusCode).toBe(400)
        expect(body.errors).not.toBeNull()
        expect(body.errors![0].toLowerCase()).toContain('body')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
        
    })

    it('should return a error when repository not created a habit', async () => {
        const { createHabitController } = makeControlleWithMocksFailed()
        const user = CreateUserValid({})

        const httpBody = {
            title: 'Any_Title',
            numbersOfWeek: 3,
            weekDays: [2, 4, 6],
        }

        const { body, statusCode } = await createHabitController.handle({
            body: httpBody,
            params: {
                userId: user.id
            }
        })        

        expect(statusCode).toBe(500)
        expect(body.errors).not.toBeNull()
        expect(body.errors![0].toLowerCase()).toContain('habit')
        expect(body.errors![0]).toBe('Habit not created!')
        expect(body.success).toBeFalsy()
        expect(body.habit).toBeNull()
        
    })

    it('should return a error when values of weekDays contains number > 6', async () => {
        const { createHabitController } = makeControlleWithMocks()
        const user = CreateUserValid({})

        const httpBody = {
            title: 'Any_Title',
            numbersOfWeek: 3,
            weekDays: [8, 4, 6],
        }

        const { body, statusCode } = await createHabitController.handle({
            body: httpBody,
            params: {
                userId: user.id
            }
        })

        expect(statusCode).toBe(500)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Week day nonexistent!')
        expect(body.habit).toBeFalsy()
        expect(body.success).toBeFalsy()

    })

    it('should return a error when values of weekDays contains number < 0', async () => {
        const { createHabitController } = makeControlleWithMocks()
        const user = CreateUserValid({})

        const httpBody = {
            title: 'Any_Title',
            numbersOfWeek: 3,
            weekDays: [-2, 4, 6],
        }

        const { body, statusCode } = await createHabitController.handle({
            body: httpBody,
            params: {
                userId: user.id
            }
        })        

        expect(statusCode).toBe(500)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Week day nonexistent!')
        expect(body.habit).toBeFalsy()
        expect(body.success).toBeFalsy()

    })

    it('should return a error when numberOfWeek to be < 0', async () => {
        const { createHabitController } = makeControlleWithMocks()
        const user = CreateUserValid({})

        const httpBody = {
            title: 'Any_Title',
            numbersOfWeek: -5,
            weekDays: [1, 4, 6],
        }

        const { body, statusCode } = await createHabitController.handle({
            body: httpBody,
            params: {
                userId: user.id
            }
        })        

        expect(statusCode).toBe(400)
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Value numbersOfWeek must be a positive!')
        expect(body.habit).toBeFalsy()
        expect(body.success).toBeFalsy()

    })
    
})
