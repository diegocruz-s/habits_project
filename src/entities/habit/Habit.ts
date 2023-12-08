import { DayHabitConclude } from "../dayHabitsConcludes/DayHabitConclude";
import { HabitWeekDay } from "../weekDays/HabitWeekDay";

export class Habit {
    readonly dayHabitsConcludes: DayHabitConclude[]
    readonly weekDays: HabitWeekDay[]

    constructor(
        readonly id: string,
        readonly title: string,
        readonly createdAt: Date,
        readonly numbersOfWeek: number,

        readonly userId: string,
    ) {
        this.dayHabitsConcludes = []
        this.weekDays = []
    }

    private isDateAheadByWeeks (date1: Date, date2: Date, weeks: number) {
        const time1 = date1.getTime()
        const time2 = date2.getTime()

        const differenceInMilliseconds = time2 - time1

        const weeksInMilliseconds = weeks * 7 * 24 * 60 * 60 * 1000

        return differenceInMilliseconds >= weeksInMilliseconds
    }

    setWeekDays (weekDay: HabitWeekDay) {
        this.weekDays.push(weekDay)
    }

    setDayHabitsConcludes (dayHabitConclude: DayHabitConclude) {
        if(this.isDateAheadByWeeks(this.createdAt, new Date(), this.numbersOfWeek)) {
            return {
                error: `The duration of the habit has been exceeded, the duration is ${this.numbersOfWeek} weeks!`
            }
        }

        const dayConcludeHabit = dayHabitConclude.day.date.getDay()

        const checkConcludeDateIsInWeekDays = this.weekDays.find(weekDay => weekDay.weekDay === dayConcludeHabit)

        if(!checkConcludeDateIsInWeekDays) {
            return {
                error: 'You can only complete a habit on the days it is available!'
            }
        }

        this.dayHabitsConcludes.push(dayHabitConclude)
    }


}