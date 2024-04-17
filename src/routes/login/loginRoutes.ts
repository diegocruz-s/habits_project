import { Router } from "express"
import { makeLoginController } from "../../factories/login/factory"

const routes = Router()

routes.post('/' , async (request, response) => {
    const { loginController } = makeLoginController()

    const { body, statusCode } = await loginController.handle({
        body: request.body
    })
    
    response.status(statusCode).json(body)

})

export {
    routes
}
