import { Habit as PrismaHabit } from '@prisma/client'

import { IReadHabitsByDayRepository } from "../../../controllers/habit/readHabitsByDay/protocols";
import { prisma } from "../../../database/prisma-client";
import { Habit } from "../../../entities/habit/Habit";

export class ReadHabitsByDayRepository implements IReadHabitsByDayRepository {

    private async validateHabit(habit: Habit, date: Date) {
        const differenceInMilliseconds = Math.abs(date.getTime() - habit.createdAt.getTime())

        const lastWeeks = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 7))
        
        if (lastWeeks >= habit.numbersOfWeek) {
            habit.isActive = false
        }

        return habit
    }

    private async validationArrayHabits (array: PrismaHabit[], date: Date): Promise<Habit[]> {
        let newArray: Habit[] = []
        for (let i=0;i<array.length;i++) {
            const newHabit = new Habit(
                array[i].id,
                array[i].title,
                array[i].createdAt,
                array[i].numbersOfWeek,
                array[i].userId,
            )

            const validateHabit = await this.validateHabit(newHabit, date)
            
            await prisma.habit.update({
                where: { id: validateHabit.id },
                data: { isActive: validateHabit.isActive },
            })
                
            if(validateHabit.isActive) {
                newArray.push(validateHabit)
            }
        }        

        return newArray
    }

    async allHabitsDay(date: Date, userId: string): Promise<Habit[]> {
        const indexDate = date.getDay()
        const startOfToday = new Date(date)
        startOfToday.setHours(0, 0, 0, 0)

        const allHabitsByDayPrisma = await prisma.habit.findMany({
            where: {
                AND: [
                    {
                        userId
                    },
                    {
                        weekDays: {
                            some: {
                                weekDay: indexDate
                            }
                        }
                    },
                    {
                        createdAt: {
                            lte: date
                        }
                    }
                ]
            }
        })        

        if (!allHabitsByDayPrisma) return []

        const allHabitsByDay = await this.validationArrayHabits(allHabitsByDayPrisma, date)

        if (!allHabitsByDay) return []

        return allHabitsByDay
    }

    async concludesHabitsDay(date: Date, userId: string): Promise<Habit[]> {
        const concludesHabitsDayPrisma = await prisma.dayHabitComplete.findMany({
            where: {
                AND: [
                    {
                        day: {
                            date: { 
                                gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                                lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                            }
                        }
                    },
                    { habit: { userId } }
                ]
            },
            include: { habit: true }
        }).then(items => {
            return items.map(item => item.habit)
        })

        if (!concludesHabitsDayPrisma) return []

        const concludesHabitsDay = await this.validationArrayHabits(concludesHabitsDayPrisma, date)

        if (!concludesHabitsDay) return []

        return concludesHabitsDay

    }

}
