export class HabitWeekDay {
    constructor(
        readonly id: string,
        readonly habitId: string,
        readonly weekDay: number,
    ) {
        const testIsValid = this.isValid(this.weekDay)

        if(testIsValid.error) {
            throw new Error(`${testIsValid.error}`)
        }

    }

    isValid (weekDay: number) {
        if ((weekDay < 0) || (weekDay > 6)) {
            return { error: 'Week day nonexistent!' }
        }
        return { success: true }
    }
}
