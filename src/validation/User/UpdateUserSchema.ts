import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.optional(z.string().min(2)),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6))
}) 