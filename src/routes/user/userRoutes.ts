import { Router } from "express"
import { makeControllerCreateUser } from "../../factories/user/create/factory"
import { makeControllerDeleteUser } from "../../factories/user/delete/factory"
import { checkAuth } from "../../helpers/checkAuth"
import { makeControllerUpdateUser } from "../../factories/user/update/factory"
import { makeControllerFindUser } from "../../factories/user/findUser/factory"

const routes = Router()

routes.post('/' , async (request, response) => {
    const { createUserController } = makeControllerCreateUser()

    const { body, statusCode } = await createUserController.handle({
        body: request.body
    })
    
    return response.status(statusCode).json(body)

})

routes.delete('/' , checkAuth, async (request, response) => {
    const { deleteUserController } = makeControllerDeleteUser()

    const { body, statusCode } = await deleteUserController.handle({
        params: {
            userId: request.userId
        }
    })
    
    return response.status(statusCode).json(body)

})

routes.patch('/', checkAuth, async (request, response) => {
    const { updateUserController } = makeControllerUpdateUser()

    const { body, statusCode } = await updateUserController.handle({
        body: request.body,
        params: {
            userId: request.userId
        }
    })

    return response.status(statusCode).json(body)
})

routes.get('/', checkAuth, async (request, response) => {
    const { findUserController } = makeControllerFindUser()

    const { body, statusCode } = await findUserController.handle({
        params: {
            userId: request.userId
        }
    })

    return response.status(statusCode).json(body)
})

export {
    routes
}
