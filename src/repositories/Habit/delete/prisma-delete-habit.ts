import { IDeleteHabitRepository } from "../../../controllers/habit/delete/protocols";
import { prisma } from "../../../database/prisma-client";

export class DeleteHabitRepository implements IDeleteHabitRepository {
    async delete(habitId: string, userId: string): Promise<{ message: string; }> {
        const findHabit = await prisma.habit.findFirst({
            where: {
                AND: [
                    { id: habitId },
                    { userId }
                ]
            }
        })

        if(!findHabit) throw new Error('Habit not found!')
        
        const deletedHabit = await prisma.habit.delete({
            where: {
                id: habitId,
                userId
            }
        })

        if(!deletedHabit) throw new Error('Error with deleted habit!')

        return {
            message: 'Habit deleted with success!'
        }
    }
}
