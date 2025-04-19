import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string(),
  gender: z.string().optional(),
  isAbandoned: z.boolean().optional().default(false),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
