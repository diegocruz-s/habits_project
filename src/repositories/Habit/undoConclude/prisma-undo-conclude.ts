import { IUndoConcludeRepository } from "../../../controllers/habit/undoConclude/protocols";
import { prisma } from "../../../database/prisma-client";
import { Habit } from "../../../entities/habit/Habit";

export class UndoConcludeRepository implements IUndoConcludeRepository {
    async undoConclude(habitId: string, userId: string, date: Date): Promise<Habit> {
        const concludeHabit = await prisma.dayHabitComplete.findFirst({
            where: {
                AND: [
                    { habitId },
                    { habit: { userId }},
                    { day: {
                        date: {
                            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                            lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                        }
                    }}
                ]
            },
            include: {
                habit: true
            }
        })

        if (!concludeHabit) throw new Error('Habit not yet completed!')

        const deletedConclude = await prisma.dayHabitComplete.delete({
            where: {
                id: concludeHabit.id
            }
        })
        
        if(!deletedConclude) throw new Error('Error with undo conclude habit!')

        const habit = new Habit(
            concludeHabit.habit.id,
            concludeHabit.habit.title,
            concludeHabit.habit.createdAt,
            concludeHabit.habit.numbersOfWeek,
            concludeHabit.habit.userId,
        )
        
        return habit
    }
}