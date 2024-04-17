import { response } from "express";
import request from 'supertest'

import { app } from "../../src";
import { login } from "../login/login";
import { User } from "../../src/entities/user/User";

export interface IDatasHabit {
    title?: string
    numbersOfWeek?: number
    weekDays?: number[]
    userDatas?: User
    tokenData?: string
}

export async function createHabit ({ title, numbersOfWeek, weekDays, userDatas, tokenData }: IDatasHabit) {
    let userFinal: User
    let tokenFinal: string

    if(userDatas && tokenData) {
        userFinal = userDatas
        tokenFinal = tokenData
    } else {
        const { user, token } = await login()
        userFinal = user
        tokenFinal = token
    }

    const today = new Date()
    const yesterday = new Date(new Date().setDate(today.getDate() - 1))
    const tomorrow = new Date(new Date().setDate(today.getDate() + 1))

    const datasHabit = {
        title: title || 'Create new habit',
        numbersOfWeek: numbersOfWeek || 3,
        weekDays: weekDays || [yesterday.getDay(), today.getDay(), tomorrow.getDay()]
    }
    const createHabitResponse = await request(app)
        .post('/habit')
        .set('Authorization', `Bearer ${tokenFinal}`)
        .send(datasHabit)    

    expect(createHabitResponse.status).toBe(201)
    expect(createHabitResponse.body.habit.id).toBeTruthy()
    expect(createHabitResponse.body.habit.title).toBe(datasHabit.title)
    expect(createHabitResponse.body.habit.numbersOfWeek).toBe(datasHabit.numbersOfWeek)
    for(let i=0;i<datasHabit.weekDays.length;i++) {
        expect(createHabitResponse.body.habit.weekDays[i].id).toBeTruthy()
        expect(createHabitResponse.body.habit.weekDays[i].habitId).toBe(createHabitResponse.body.habit.id)
        expect(datasHabit.weekDays[i]).toBe(createHabitResponse.body.habit.weekDays[i].weekDay)
    }
    expect(createHabitResponse.body.success).toBeTruthy()
    expect(createHabitResponse.body.errors).toBeNull()

    return {
        habit: createHabitResponse.body.habit,
        token: tokenFinal,
        user: userFinal
    }
}


