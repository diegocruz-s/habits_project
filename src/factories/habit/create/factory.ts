import { CreateHabitController } from "../../../controllers/habit/create/create-habit"
import { ICreateHabitController } from "../../../controllers/habit/create/protocols"
import { PrismaCreateHabitRepository } from "../../../repositories/Habit/create/prisma-create-habit"

export interface IMakeCreateHabitController {
    createHabitController: ICreateHabitController
}

export const makeCreateHabitController = (): IMakeCreateHabitController => {
    const createHabitRepository = new PrismaCreateHabitRepository()
    const createHabitController = new CreateHabitController(createHabitRepository)

    return {
        createHabitController
    }
}
