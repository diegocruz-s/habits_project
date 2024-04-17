import { z } from "zod";

export const ReadByDayHabits = z.object({
    userId: z.string(),
    date: z.date(),
})