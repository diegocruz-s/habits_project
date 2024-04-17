import { DeleteHabitController } from "../../../controllers/habit/delete/delete-habit"
import { DeleteHabitRepository } from "../../../repositories/Habit/delete/prisma-delete-habit"

export const makeDeleteHabitController= () => {
    const deleteHabitRepository = new DeleteHabitRepository()

    const deleteHabitController = new DeleteHabitController(deleteHabitRepository)

    return {
        deleteHabitController
    }
}