import { UndoConcludeController } from "../../../controllers/habit/undoConclude/undo-conclude"
import { UndoConcludeRepository } from "../../../repositories/Habit/undoConclude/prisma-undo-conclude"

export const makeUndoConcludeHabitController = () => {
    const undoConcludeRepository = new UndoConcludeRepository()
    const undoConcludeController =new UndoConcludeController(undoConcludeRepository)

    return {
        undoConcludeController
    }
}