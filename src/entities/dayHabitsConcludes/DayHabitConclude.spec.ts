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
        const dayHabitConclude = new DayHabitConclude(randomUUID(), day, habit.id)

        expect(dayHabitConclude.id).toBeTruthy()
        expect(dayHabitConclude.day).toBe(day)
        expect(dayHabitConclude.day.date).toBe(date)
        expect(dayHabitConclude.day.date.getDay()).toBe(habit.weekDays[0].weekDay)
        expect(dayHabitConclude.habitId).toBe(habit.id)
    })
})