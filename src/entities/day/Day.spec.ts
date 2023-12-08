import { randomUUID } from "crypto"
import { Day } from "./Day"
import { CreateHabitWithBeforeYesterday } from "../../../tests/factories/Habit"
import { DayHabitConclude } from "../dayHabitsConcludes/DayHabitConclude"
import { HabitWeekDay } from "../weekDays/HabitWeekDay"

describe('Day', () => {
    it('should create a Day', () => {
        const date = new Date()
        const day = new Day(randomUUID(), date)

        expect(day.id).toBeTruthy()
        expect(day.date).toBe(date)
    })

    it('should create a Day with dayHabitConclude', () => {
        const date = new Date()
        const habit = CreateHabitWithBeforeYesterday()
        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, date.getDay()))

        const day = new Day(randomUUID(), date)

        const dayHabitConclude = new DayHabitConclude(randomUUID(), day, habit.id)
        habit.setDayHabitsConcludes(dayHabitConclude)
        day.setDayHabitConclude(dayHabitConclude)

        expect(day.date).toBe(date)
        expect(day.dayHabitConclude[0]).toBe(dayHabitConclude)
        expect(day.dayHabitConclude[0]).toBe(habit.dayHabitsConcludes[0])
    })
})
