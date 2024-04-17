import { Router } from "express";
import { makeCreateHabitController } from "../../factories/habit/create/factory";
import { checkAuth } from "../../helpers/checkAuth";
import { makeConcludeHabitController } from "../../factories/habit/conclude/factory";
import { makeUndoConcludeHabitController } from "../../factories/habit/undoConclude/factory";
import { makeReadByDayController } from "../../factories/habit/readByDay/factory";
import { makeDeleteHabitController } from "../../factories/habit/delete/factory";
import { makeUpdateHabitController } from "../../factories/habit/update/factory";

const routes = Router()

routes.post('/', checkAuth, async (request, response) => {
    const { createHabitController } = makeCreateHabitController()

    const { body, statusCode } = await createHabitController.handle({
        body: request.body,
        params: {
            userId: request.userId,
        }
    })

    return response.status(statusCode).json(body)
})

routes.post('/:habitId/:date', checkAuth, async (request, response) => {
    const { habitConcludeController } = makeConcludeHabitController()
    
    const { body, statusCode } = await habitConcludeController.handle({
        params: {
            habitId: request.params.habitId,
            date: new Date(request.params.date),
            userId: request.userId
        }
    })    

    return response.status(statusCode).json(body)
})

routes.post('/undo/:habitId/:date', checkAuth, async (request, response) => {
    const { undoConcludeController } = makeUndoConcludeHabitController()

    const { statusCode, body } = await undoConcludeController.handle({
        params: {
            habitId: request.params.habitId,
            userId: request.userId,
            date: new Date(request.params.date)
        }
    })

    return response.status(statusCode).json(body)
})

routes.get('/:date', checkAuth, async (request, response) => {
    const { readByDayController } = makeReadByDayController()

    const { statusCode, body } = await readByDayController.handle({
        params: {
            date: new Date(request.params.date),
            userId: request.userId
        }
    })

    return response.status(statusCode).json(body)
})

routes.delete('/:habitId', checkAuth, async (request, response) => {
    const { deleteHabitController } = makeDeleteHabitController()

    const { statusCode, body } = await deleteHabitController.handle({
        params: {
            habitId: request.params.habitId,
            userId: request.userId,
        }
    })

    return response.status(statusCode).json(body)
})

routes.patch('/:habitId', checkAuth, async (request, response) => {
    const { updatedHabitController } = makeUpdateHabitController()

    const { body, statusCode } = await updatedHabitController.handle({
        body: request.body,
        params: {
            habitId: request.params.habitId,
            userId: request.userId,
        }
    })

    return response.status(statusCode).json(body)
})

export {
    routes
}
