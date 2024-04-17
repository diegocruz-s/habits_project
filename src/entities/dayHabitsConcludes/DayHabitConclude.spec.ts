import { randomUUID } from "crypto"
import { CreateHabitWithBeforeYesterday } from "../../../tests/factories/Habit"
import { Day } from "../day/Day"
import { DayHabitConclude } from "./DayHabitConclude"
import { HabitWeekDay } from "../weekDays/HabitWeekDay"

describe('DayHabitConclude', () => {
    it('should create a DayHabitConclude', () => {
        const habit = CreateHabitWithBeforeYesterday()
        const date = new Date(new Date().getTime() - 864000)
        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, date.getDay()))

        const day = new Day(randomUUID(), date)
        const dayHabitConclude = new DayHabitConclude(randomUUID(), day, habit)                

        expect(dayHabitConclude.success).not.toBeNull()
        expect(dayHabitConclude.id).toBeTruthy()
        expect(dayHabitConclude.day).toBe(day)
        expect(dayHabitConclude.day.date).toBe(date)
        expect(dayHabitConclude.day.date.getDay()).toBe(habit.weekDays[0].weekDay)
        expect(dayHabitConclude.habit.id).toBe(habit.id)
    })

    it('should not create a DayHabitConclude with the completion date after the Habit activation period', () => {
        const habit = CreateHabitWithBeforeYesterday()
        const date = new Date(new Date().getTime() + 1900800000)
            // 22 days after
        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, date.getDay()))

        const day = new Day(randomUUID(), date)
        const dayHabitConclude = new DayHabitConclude(randomUUID(), day, habit)
                

        expect(dayHabitConclude).toHaveProperty('error')
        expect(dayHabitConclude.error).not.toBeNull()
    })

    it('should not create a DayHabitConclude if the completion date is not in weekDay', () => {
        const habit = CreateHabitWithBeforeYesterday()
        const date = new Date(new Date().getTime() - 864000)
            // 22 days after
        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, date.getDay() + 1))

        const day = new Day(randomUUID(), date)
        const dayHabitConclude = new DayHabitConclude(randomUUID(), day, habit)
                

        expect(dayHabitConclude).toHaveProperty('error')
        expect(dayHabitConclude.error).not.toBeNull()
    })
})