import { randomUUID } from "crypto"

import { CreateHabitWithBeforeYesterday } from "../../../tests/factories/Habit"
import { CreateUserValid } from "../../../tests/factories/User"
import { Day } from "../day/Day"
import { DayHabitConclude } from "../dayHabitsConcludes/DayHabitConclude"
import { HabitWeekDay } from '../weekDays/HabitWeekDay'
import { Habit } from "./Habit"

describe('Habit', () => {
    it('should create a habit', () => {
        const id = randomUUID()
        const title = 'any_title'
        const createdAt = new Date()
        const numbersOfWeek = 3
        const userId = randomUUID()

        const habit = new Habit(id, title, createdAt, numbersOfWeek, userId)

        expect(habit.id).toBe(id)
        expect(habit.title).toBe(title)
        expect(habit.createdAt).toBe(createdAt)
        expect(habit.numbersOfWeek).toBe(numbersOfWeek)
        expect(habit.userId).toBe(userId)
    })

    it('should create a habit with user is valid', () => {
        const user = CreateUserValid({})

        const id = randomUUID()
        const title = 'any_title'
        const createdAt = new Date()
        const numbersOfWeek = 3
        const userId = user.id

        const habit = new Habit(id, title, createdAt, numbersOfWeek, userId)

        expect(habit.id).toBe(id)
        expect(habit.userId).toBe(user.id)
    })

    it('should create a habit for days of week', () => {
        const user = CreateUserValid({})
        const id = randomUUID()
        const title = 'any_title'
        const createdAt = new Date()
        const numbersOfWeek = 3
        const userId = user.id
        const habit = new Habit(id, title, createdAt, numbersOfWeek, userId)

        for (let i=0;i<=3;i++) {
            const weekDay = new HabitWeekDay(randomUUID(), habit.id, i)
            habit.setWeekDays(weekDay)
        }

        expect(habit.weekDays.length).toBe(4)

        for(const weekDay of habit.weekDays) {
            expect(weekDay.habitId).toBe(habit.id)
        }
        
    })

    it('should create a habit and add datas in dayHabitsConcludes', () => {
        const habit = CreateHabitWithBeforeYesterday()
        
        const yesterdayDate = new Date(new Date().getTime() - 86400000)
        const yesterday = new Day(randomUUID(), yesterdayDate)
        const today = new Day(randomUUID(), new Date())
        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, yesterday.date.getDay()))
        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, today.date.getDay()))

        const daysHabitsConcludes = [
            new DayHabitConclude(randomUUID(), yesterday, habit),
            new DayHabitConclude(randomUUID(), today, habit)
        ]

        expect(habit.dayHabitsConcludes.length).toBe(2)
        expect(habit.dayHabitsConcludes[0].day).toBe(yesterday)
        expect(habit.dayHabitsConcludes[0].habit.id).toBe(habit.id)
        expect(habit.dayHabitsConcludes[1].day).toBe(today)
        expect(habit.dayHabitsConcludes[1].habit.id).toBe(habit.id)
    })

    it('should return an error when trying to complete a habit on a day that is not contained in the weekDay', () => {
        const habit = CreateHabitWithBeforeYesterday()
        
        const beforeyesterdayDate = new Date(new Date().getTime() - 172800000)
        const beforeYesterday = new Day(randomUUID(), beforeyesterdayDate)
        const yesterday = new Day(randomUUID(), new Date(new Date().getTime() - 86400000))

        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, yesterday.date.getDay()))

        const daysHabitsConcludes = new DayHabitConclude(randomUUID(), beforeYesterday, habit)

        expect(daysHabitsConcludes.error).not.toBeNull()
        
    })

    it('should return an error when trying to complete a task after its activation period', () => {
        const createdAt = new Date(new Date().getTime() - 2419200000)
        const habit = CreateHabitWithBeforeYesterday(createdAt)
        
        const today = new Day(randomUUID(), new Date())

        habit.setWeekDays(new HabitWeekDay(randomUUID(), habit.id, createdAt.getDay()))

        const daysHabitsConcludes = new DayHabitConclude(randomUUID(), today, habit)

        expect(createdAt.getDay()).toBe(today.date.getDay())
        expect(daysHabitsConcludes.error).not.toBeNull()
        
    })
})