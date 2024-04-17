import { HabitConcludeController } from "../../../controllers/habit/conclude/habit-conclude"
import { HabitConcludeRepository } from "../../../repositories/Habit/conclude/prisma-conclude-habit"

export const makeConcludeHabitController = () => {
    const habitConcludeRepository = new HabitConcludeRepository()

    const habitConcludeController = new HabitConcludeController(habitConcludeRepository)

    return {
        habitConcludeController
    }
}
