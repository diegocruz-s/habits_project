import { z } from "zod";

export const ConcludeAndUndoHabit = z.object({
    userId: z.string(),
    date: z.date(),
    habitId: z.string(),
})