import express, { Express } from 'express'
import { routes as userRoutes } from './routes/user/userRoutes'
import { routes as loginRoutes } from './routes/login/loginRoutes'
import { routes as habitRoutes } from './routes/habit/habitRoutes'

export class AppController {
    app: Express

    constructor () {
        this.app = express()
        this.setDatas()
        this.middlewares()
        this.routes()
    }

    private setDatas () {
        this.app.use(express.json())
    }

    private middlewares () {

    }

    private routes () {
        this.app.use('/user', userRoutes)
        this.app.use('/auth', loginRoutes) 
        this.app.use('/habit', habitRoutes)
    }
}

const app = new AppController().app

export {
    app
}
