import { randomUUID } from "crypto"
import { HabitWeekDay } from "./HabitWeekDay"
import { CreateHabitWithBeforeYesterday } from "../../../tests/factories/Habit"

describe('HabitWeekDay', () => {
    it('should create a HabitWeekDay', () => {
        const id = randomUUID()
        const habit = CreateHabitWithBeforeYesterday()
        const weekDay = 3

        const habitWeekDay = new HabitWeekDay(id, habit.id, weekDay)

        expect(habitWeekDay.id).toBeTruthy()
        expect(habitWeekDay.id).toBe(id)
        expect(habitWeekDay.habitId).toBe(habit.id)
        expect(habitWeekDay.weekDay).toBe(weekDay)
    })

    it('should return an error when weekDay is less than 0', () => {
        const id = randomUUID()
        const habit = CreateHabitWithBeforeYesterday()
        const weekDay = -1

        try {
            
            const habitWeekDay = new HabitWeekDay(id, habit.id, weekDay)
    
            console.log('habitWeekDay: ', habitWeekDay)
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })

    it('should return an error when weekDay is greater than 6', () => {
        const id = randomUUID()
        const habit = CreateHabitWithBeforeYesterday()
        const weekDay = 7

        try {
            new HabitWeekDay(id, habit.id, weekDay)
        } catch (error) {
            expect(error).toBeTruthy()
            expect(error).toBeInstanceOf(Error)
        }
    })
})