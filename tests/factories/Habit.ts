import { faker } from "@faker-js/faker"
import { randomUUID } from "crypto"

import { Habit } from "../../src/entities/habit/Habit"
import { HabitWeekDay } from "../../src/entities/weekDays/HabitWeekDay"
import { CreateUserValid } from "./User"

export const CreateHabitWithBeforeYesterday = (date?: Date): Habit => {
    const user = CreateUserValid({})
    const id = randomUUID()
    const title = 'any_title'
    const beforeYesterday = date ?? new Date(new Date().getTime() - 172800000) // antes de ontem
    const numbersOfWeek = 3
    const userId = user.id
    const habit = new Habit(id, title, beforeYesterday, numbersOfWeek, userId)

    return habit
}

interface IDatasHabit {
    user?: {
        id?: string
        email?: string
        password?: string
    },
    habit?: {
        id?: string
        title?: string
        date?: Date
        numbersOfWeek?: number
        weekDays?: number[]
        isActive?: boolean
    }
}

export const CreateHabitValid = (datas?: IDatasHabit) => {
    const user = CreateUserValid({
        id: datas?.user?.id || undefined,
        email: datas?.user?.email || undefined, 
        password: datas?.user?.password || undefined
    })

    const title = datas?.habit?.title || faker.lorem.words()
    const date = datas?.habit?.date || new Date()
    const numbersOfWeek = datas?.habit?.numbersOfWeek || Math.floor(Math.random() * 7) + 3
    const userId = user.id
    const weekDays = datas?.habit?.weekDays || [1, new Date().getDay(), 5]
    const habit = new Habit(datas?.habit?.id || randomUUID(), title, date, numbersOfWeek, userId)

    for(const weekDay of weekDays) {
        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, weekDay))
    }
    
    if(datas?.habit?.isActive === false) {
        habit.isActive = false        
    }

    return habit
}
