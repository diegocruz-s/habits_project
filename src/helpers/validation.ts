import { Schema } from "zod"

export interface Parameters {
    schema: Schema
    content: unknown
}

interface ReturnValidation {
    errors?: string[]
}

export const validation = async ({ content, schema }: Parameters): Promise<ReturnValidation> => {
    try {
        await schema.parse(content)

        return {}
    } catch (error: any) {
        const errors: string[] = []
        error.issues.forEach((err: any) => {
            errors.push(`${err.path[0]}: ${err.message}`)
        })
        
        return {
            errors
        }
    }    
}