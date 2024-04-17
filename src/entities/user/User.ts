export interface IReturnIsUserValid {
    errors: (string | null)[]
    valid: boolean
}

export interface IDatasNewUser {
    id: string
    name: string
    email: string
    password: string
}

export class User { 
    isActive: boolean

    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly password: string,
    ) {
        this.isActive = true
    }

    isValid (): IReturnIsUserValid {
        const fieldsUser = Object.getOwnPropertyNames(this)

        const arrayContentErrors = fieldsUser
            .map(property => (!!this[property as keyof User]) ? null : `Property ${property} is missing!`)
            .filter(item => !!item)
    
        return {
            errors: arrayContentErrors,
            valid: arrayContentErrors.length > 0 ? false : true
        }  
    }

}
