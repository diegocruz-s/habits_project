import { ICreateHabitRepository } from "../../../controllers/habit/create/protocols";
import { prisma } from "../../../database/prisma-client";
import { Habit } from "../../../entities/habit/Habit";

export class PrismaCreateHabitRepository implements ICreateHabitRepository {
    async create(datas: Habit): Promise<Habit> {
        const user = await prisma.user.findUnique({
            where: {
                id: datas.userId
            }
        })        
        
        if (!user) throw new Error('User not found!')

        const { createdAt, numbersOfWeek, title, userId, weekDays } = datas

        const habitPrisma = await prisma.habit.create({
            data: {
                id: datas.id,
                createdAt,
                numbersOfWeek,
                title,
                userId,
                weekDays: {
                    createMany: {
                        data: weekDays.map(wd => ({
                            weekDay: wd.weekDay
                        }))
                    }
                }
            }
        })

        if (!habitPrisma) throw new Error('Habit is not created!')
        
        return datas
    }
}