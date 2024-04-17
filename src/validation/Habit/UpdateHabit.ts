import { z } from "zod";

export const updateHabitSchema = z.object({
    title: z.optional(z.string().min(2)),
    numbersOfWeek: z.optional(z.number()),
    weekDays: z.optional(z.array(z.number()))
}) 
