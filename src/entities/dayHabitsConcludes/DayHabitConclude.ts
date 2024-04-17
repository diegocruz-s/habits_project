import { Day } from "../day/Day";
import { Habit } from "../habit/Habit";

export class DayHabitConclude {
    error: string | null = null 
    success: string | null = null 

    constructor (
        readonly id: string,
        readonly day: Day,
        readonly habit: Habit,
    ) {
        this.setDayHabitsConcludes()
    }

    private isDateAheadByWeeks (date1: Date, date2: Date, weeks: number) {
        const time1 = date1.getTime()
        const time2 = date2.getTime()

        const differenceInMilliseconds = time2 - time1

        const weeksInMilliseconds = weeks * 7 * 24 * 60 * 60 * 1000

        return differenceInMilliseconds >= weeksInMilliseconds
    }

    setDayHabitsConcludes () {
        if(this.isDateAheadByWeeks(this.habit.createdAt, this.day.date, this.habit.numbersOfWeek)) {
            return this.error = `The duration of the habit has been exceeded, the duration is ${this.habit.numbersOfWeek} weeks!`
        }

        const dayConcludeHabit = this.day.date.getDay()

        const checkConcludeDateIsInWeekDays = this.habit.weekDays.find(weekDay => weekDay.weekDay === dayConcludeHabit)

        if(!checkConcludeDateIsInWeekDays) {
            return this.error = 'You can only complete a habit on the days it is available!'
        }

        this.habit.setDayHabitConclude(this)
        this.day.setDayHabitConclude(this)
 
        this.success = 'Day habit created by successfully!'
    }

    toJSON () {
        return {
            id: this.id,
            error: this.error,
            success: this.success,
            day: { id: this.day.id, date: this.day.date },
            habit: { id: this.habit.id, userId: this.habit.userId }
        }
    }

} 
