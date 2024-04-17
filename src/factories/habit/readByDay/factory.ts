import { ReadHabitsByDayController } from "../../../controllers/habit/readHabitsByDay/read-by-day"
import { ReadHabitsByDayRepository } from "../../../repositories/Habit/readByDay/prisma-read-by-day"

export const makeReadByDayController = () => {
    const readByDayRepository = new ReadHabitsByDayRepository()
    const readByDayController = new ReadHabitsByDayController(readByDayRepository)

    return {
        readByDayController
    }
}