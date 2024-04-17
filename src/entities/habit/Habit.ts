import { DayHabitConclude } from "../dayHabitsConcludes/DayHabitConclude";
import { HabitWeekDay } from "../weekDays/HabitWeekDay";

export class Habit {
    readonly dayHabitsConcludes: DayHabitConclude[]
    readonly weekDays: HabitWeekDay[]
    isActive: boolean

    constructor(
        readonly id: string,
        readonly title: string,
        readonly createdAt: Date,
        readonly numbersOfWeek: number,
        readonly userId: string,
    ) {
        this.dayHabitsConcludes = []
        this.weekDays = []
        this.isActive = true
    }

    setWeekDays (weekDay: HabitWeekDay) {
        this.weekDays.push(weekDay)
    }

    setDayHabitConclude (dayHabitConclude: DayHabitConclude) {
        this.dayHabitsConcludes.push(dayHabitConclude)
    }


}