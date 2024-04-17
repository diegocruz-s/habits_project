import { UpdateHabitController } from "../../../controllers/habit/update/update-habit"
import { UpdateHabitRepository } from "../../../repositories/Habit/update/prisma-update-habit"


export const makeUpdateHabitController = () => {
    const updateHabitRepository = new UpdateHabitRepository()

    const updatedHabitController = new UpdateHabitController(updateHabitRepository)

    return {
        updatedHabitController
    }
}
