import { DayHabitConclude } from "../dayHabitsConcludes/DayHabitConclude";

export class Day {
    dayHabitConclude: DayHabitConclude[]

    constructor (
        readonly id: string,
        readonly date: Date,
    ) {
        this.dayHabitConclude = []
    }

    setDayHabitConclude (dayHabitConclude: DayHabitConclude) {
        this.dayHabitConclude.push(dayHabitConclude)
    }

}
