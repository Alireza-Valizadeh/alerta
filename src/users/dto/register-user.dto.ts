import { z } from 'zod';
import { Gender } from '../enums/genders.enum';

const genderValues = Object.values(Gender) as string[];
export const genderSchema = z.enum([
  genderValues[0],
  genderValues[1],
  genderValues[2],
  genderValues[3],
]);

export const registerUserSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  gender: genderSchema.optional(),
  isAbandoned: z.boolean().optional().default(false),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
