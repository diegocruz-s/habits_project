import { CreateHabitValid } from "../../../../tests/factories/Habit"
import { Day } from "../../../entities/day/Day"
import { DayHabitConclude } from "../../../entities/dayHabitsConcludes/DayHabitConclude"
import { Habit } from "../../../entities/habit/Habit"
import { IReadHabitsByDayRepository } from "./protocols"
import { ReadHabitsByDayController } from "./read-by-day"

let setUserId = 'any_userId_value'

const makeFakeRepository = () => {
    class ReadHabitsByDayRepository implements IReadHabitsByDayRepository {
        public habits: Habit[] = []

        constructor() {
            for (let i=0;i<=6;i++) {
                if(i === 5) {
                    this.habits.push(CreateHabitValid({ 
                        user: { id: setUserId },
                        habit: { title: 'Expired_habit', isActive: false }
                    }))
                    continue
                }
                if(i === 6) {
                    this.habits.push(CreateHabitValid({ 
                        user: { id: setUserId },
                        habit: { 
                            date: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), 
                            weekDays: [
                                new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).getDay(),
                                new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).getDay()
                            ],
                            title: 'Habit_not_disponible_in_weekDay'
                        }
                    }))
                    continue
                }
                this.habits.push(CreateHabitValid({ user: { id: setUserId } }))
            }
        }

        async allHabitsDay(date: Date, userId: string): Promise<Habit[]> {
            const indexDate = date.getDay()
            const allHabitsByDay = this.habits.filter(
                habit => {
                    
                    const match =  
                        habit.userId === userId && 
                        habit.weekDays.some(wk => wk.weekDay === indexDate) &&
                        habit.isActive === true
                    
                    return match
                }
            )            
            
            return allHabitsByDay
        }
        
        async concludesHabitsDay(date: Date, userId: string): Promise<Habit[]> {
            const dayHabitOneConclude = new DayHabitConclude(
                'id_habitOneConclude',
                new Day('id_day_habit_one', date),
                this.habits[0]    
            )
            const dayHabitTwoConclude = new DayHabitConclude(
                'Any_id_habitTwoConclude',
                new Day('id_day_habit_two', date),
                this.habits[1]    
            )
            this.habits[0].setDayHabitConclude(dayHabitOneConclude)
            this.habits[1].setDayHabitConclude(dayHabitTwoConclude)

            const habitsConcludes = this.habits.filter(
                habit => habit.dayHabitsConcludes.length > 0
            )

            return habitsConcludes
        }
    }

    const readHabitsByDayRepository = new ReadHabitsByDayRepository()

    return {
        readHabitsByDayRepository
    }
}

const makeControllerWithMocks = () => {
    const { readHabitsByDayRepository } = makeFakeRepository()
    const readHabitsByDayController = new ReadHabitsByDayController(readHabitsByDayRepository)

    return {
        readHabitsByDayRepository,
        readHabitsByDayController
    }
}

const makeFakeRepositoryFailed = () => {
    class ReadHabitsByDayRepository implements IReadHabitsByDayRepository {
        public habits: Habit[] = []

        constructor() {
            for (let i=0;i<=4;i++) {
                this.habits.push(CreateHabitValid({ user: { id: setUserId } }))
            }
        }

        async allHabitsDay(date: Date, userId: string): Promise<Habit[]> {
            throw new Error('Error allHabitsDay!')
        }
        
        async concludesHabitsDay(date: Date): Promise<Habit[]> {
            throw new Error('Error concludesHabitsDay!')
        }
            
    }

    const readHabitsByDayRepository = new ReadHabitsByDayRepository()

    return {
        readHabitsByDayRepository
    }
}

const makeControllerWithMocksFailed = () => {
    const { readHabitsByDayRepository } = makeFakeRepositoryFailed()
    const readHabitsByDayController = new ReadHabitsByDayController(readHabitsByDayRepository)

    return {
        readHabitsByDayRepository,
        readHabitsByDayController
    }
}

describe('ReadHabitsByDayController', () => {
    it('should return a possibles and concludes habits', async () => {
        const { readHabitsByDayController, readHabitsByDayRepository } = makeControllerWithMocks()

        const { statusCode, body } = await readHabitsByDayController.handle({
            params: {
                date: new Date(),
                userId: setUserId
            }
        })        

        expect(statusCode).toBe(200)
        expect(body.errors).toBeNull()
        expect(body.habits?.possibleHabits).toBeTruthy()
        expect(body.habits?.possibleHabits.length).toBe(3)
        expect(body.habits?.possibleHabits[0]).toEqual(readHabitsByDayRepository.habits[2])
        expect(body.habits?.possibleHabits[1]).toEqual(readHabitsByDayRepository.habits[3])
        expect(body.habits?.possibleHabits[2]).toEqual(readHabitsByDayRepository.habits[4])
        expect(body.habits?.completeHabits).toBeTruthy()
        expect(body.habits?.completeHabits[0]).toEqual(readHabitsByDayRepository.habits[0])
        expect(body.habits?.completeHabits[1]).toEqual(readHabitsByDayRepository.habits[1])
        expect(body.habits?.completeHabits.length).toBe(2)
    })

    it('should return a error when date is not provided', async () => {
        const { readHabitsByDayController, readHabitsByDayRepository } = makeControllerWithMocks()

        const { statusCode, body } = await readHabitsByDayController.handle({
            params: {
                userId: setUserId
            }
        })

        expect(statusCode).toBe(400)
        expect(body.habits).toBeNull()
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toContain('date')
    })

    it('should return a error when date is not type Date', async () => {
        const { readHabitsByDayController, readHabitsByDayRepository } = makeControllerWithMocks()

        const { statusCode, body } = await readHabitsByDayController.handle({
            params: {
                date: 'any_date',
                userId: setUserId
            }
        })

        expect(statusCode).toBe(400)
        expect(body.habits).toBeNull()
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toContain('date')
    })

    it('should return a error when userId is not provided', async () => {
        const { readHabitsByDayController, readHabitsByDayRepository } = makeControllerWithMocks()

        const { statusCode, body } = await readHabitsByDayController.handle({
            params: {
                date: new Date()
            }
        })

        expect(statusCode).toBe(400)
        expect(body.habits).toBeNull()
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toContain('userId')
    })

    it('should return a error when repository throw error', async () => {
        const { readHabitsByDayController } = makeControllerWithMocksFailed()

        const { statusCode, body } = await readHabitsByDayController.handle({
            params: {
                date: new Date(),
                userId: setUserId
            }
        })

        expect(statusCode).toBe(500)
        expect(body.habits).toBeNull()
        expect(body.errors).toBeTruthy()
        expect(body.errors![0]).toBe('Error allHabitsDay!')
    })
})
