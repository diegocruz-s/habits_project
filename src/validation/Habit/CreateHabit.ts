import { z } from "zod";

export const CreateHabitSchema = z.object({
    title: z.string(),
    numbersOfWeek: z.number(),
    weekDays: z.array(z.number()),
})