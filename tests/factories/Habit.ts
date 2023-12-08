import { randomUUID } from "crypto"
import { CreateUserValid } from "./User"
import { Habit } from "../../src/entities/habit/Habit"
import { Day } from "../../src/entities/day/Day"
import { HabitWeekDay } from "../../src/entities/weekDays/HabitWeekDay"
import { DayHabitConclude } from "../../src/entities/dayHabitsConcludes/DayHabitConclude"

export const CreateHabitWithBeforeYesterday = (date?: Date): Habit => {
    const user = CreateUserValid()
    const id = randomUUID()
    const title = 'any_title'
    const beforeYesterday = date ?? new Date(new Date().getTime() - 172800000) // antes de ontem
    const numbersOfWeek = 3
    const userId = user.id
    const habit = new Habit(id, title, beforeYesterday, numbersOfWeek, userId)

    return habit
}