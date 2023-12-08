import { randomUUID } from "crypto"
import { User } from "./User"
import { CreateUserValid } from "../../../tests/factories/User"

describe('User', () => {
    it('should create a user valid', () => {
        const { id, name, email, password } = {
            id: randomUUID(),
            name: 'any_name',
            email: 'any_email',
            password: 'any_pass'

        }
        const user = new User(id, name, email, password)
        const { errors, valid } = user.isValid()

        expect(user.id).toBe(id)
        expect(user.name).toBe(name)
        expect(user.email).toBe(email)
        expect(user.password).toBe(password)
        expect(valid).toBe(true)
        expect(errors.length).toBe(0)
    })

    it('should return errors with email is not provided', () => {
        const { id, name, email, password } = {
            id: randomUUID(),
            name: 'any_name',
            email: '',
            password: 'any_pass'

        }
        const user = new User(id, name, email, password)
        const { errors, valid } = user.isValid()

        expect(valid).toBe(false)
        expect(errors.length).toBe(1)
        expect(errors[0]).toContain('email')
    })

    it('should return errors with email is not provided', () => {
        const { id, name, email, password } = {
            id: '',
            name: '',
            email: '',
            password: ''

        }
        const user = new User(id, name, email, password)
        const { errors, valid } = user.isValid()        

        expect(valid).toBe(false)
        expect(errors.length).toBe(4)

        errors.map((error, i) => {
            expect(error).toContain(Object.getOwnPropertyNames(user)[i])
            i++
        })
        
    })

})
