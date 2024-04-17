import { IDatasHabitUpdateRepository, IUpdateHabitRepository } from "../../../controllers/habit/update/protocols";
import { prisma } from "../../../database/prisma-client";
import { Habit } from "../../../entities/habit/Habit";
import { HabitWeekDay } from "../../../entities/weekDays/HabitWeekDay";

export class UpdateHabitRepository implements IUpdateHabitRepository {
    async findHabit(habitId: string, userId: string): Promise<Habit> {
        const habitPrisma = await prisma.habit.findUnique({
            where: {
                id: habitId,
                userId
            },
            include: {
                weekDays: true
            }
        })

        if (!habitPrisma) throw new Error('Habit not found!')
        
        const habitEntity = new Habit(
            habitPrisma.id,
            habitPrisma.title,
            habitPrisma.createdAt,
            habitPrisma.numbersOfWeek,
            habitPrisma.userId
        )
        for (let i=0;i<habitPrisma.weekDays.length;i++) {
            const habitWeekDay = new HabitWeekDay(
                habitPrisma.weekDays[0].id,
                habitPrisma.weekDays[0].habitId,
                habitPrisma.weekDays[0].weekDay,
            )
            habitEntity.setWeekDays(habitWeekDay)
        }

        return habitEntity
        
    }

    async update(habitId: string, userId: string, datas: IDatasHabitUpdateRepository): Promise<Habit> {
        const habitPrisma = await prisma.habit.findUnique({
            where: {
                id: habitId,
                userId
            }
        })

        if (!habitPrisma) throw new Error('Habit not found!')

        const { weekDays, ...rest } = datas

        const updatedHabit = await prisma.habit.update({
            where: {
                id: habitId,
                userId: userId
            },
            data: {
                ...(
                    weekDays
                    ? {
                        weekDays: {
                            deleteMany: {},
                            createMany: {
                                data: weekDays.map(wd => ({
                                    weekDay: wd.weekDay
                                }))
                            }
                        },
                    } : {}
                ),
                ...rest
            },
            include: {
                weekDays: true
            }
        })

        if (!updatedHabit) throw new Error('Error with updated a habit!')        

        const habitUpdatedEntity = new Habit(
            updatedHabit.id,
            updatedHabit.title,
            updatedHabit.createdAt,
            updatedHabit.numbersOfWeek,
            updatedHabit.userId
        )
        for (let i=0;i<updatedHabit.weekDays.length;i++) {
            const habitWeekDay = new HabitWeekDay(
                updatedHabit.weekDays[i].id,
                updatedHabit.weekDays[i].habitId,
                updatedHabit.weekDays[i].weekDay,
            )
            habitUpdatedEntity.setWeekDays(habitWeekDay)
        }

        return habitUpdatedEntity
    }
}