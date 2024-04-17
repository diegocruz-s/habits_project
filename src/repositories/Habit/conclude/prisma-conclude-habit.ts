import { randomUUID } from "crypto";
import { IConcludeHabitRepository } from "../../../controllers/habit/conclude/protocols";
import { prisma } from "../../../database/prisma-client";
import { Day } from "../../../entities/day/Day";
import { DayHabitConclude } from "../../../entities/dayHabitsConcludes/DayHabitConclude";
import { Habit } from "../../../entities/habit/Habit";
import { HabitWeekDay } from "../../../entities/weekDays/HabitWeekDay";

export class HabitConcludeRepository implements IConcludeHabitRepository {
    async conclude(habitId: string, userId: string, day: Day): Promise<DayHabitConclude> {
        const { date } = day
        const indexDate = date.getDay()

        const habit = await prisma.habit.findFirst({
            where: {
                id: habitId,
                userId,
                weekDays: {
                    some: { weekDay: indexDate }
                }
            },
            include: {
                weekDays: true
            }
        })

        if (!habit) throw new Error('Habit not found!');

        const existingConclude = await prisma.dayHabitComplete.findFirst({
            where: {
                habitId,
                day: {
                    date: {
                        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                    }
                },
            },
        })        
        
        if (existingConclude) throw new Error('Habit already concluded on this day!');
        
        const newDay = await prisma.day.create({
            data: {
                date
            }
        })

        const habitConcludePrisma = await prisma.dayHabitComplete.create({
            data: {
                habitId,
                dayId: newDay.id
            }
        })

        if(!habitConcludePrisma) throw new Error('Error with conclude habit!') 

        const habitEntity = new Habit(
            habit.id,
            habit.title,
            habit.createdAt,
            habit.numbersOfWeek,
            habit.userId
        )
        for(const wk of habit.weekDays) {
            const habitWeekDay = new HabitWeekDay(randomUUID(), habit.id, wk.weekDay)
            habitEntity.setWeekDays(habitWeekDay)
        }

        const habitConcludeEntity = new DayHabitConclude(
            habitConcludePrisma.id,
            day,
            habitEntity
        )
        
        return habitConcludeEntity
        

    }
}