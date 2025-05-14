import { z } from 'zod';

export const registerUserV2Schema = z.object({
  phone: z.string().min(11).max(11).startsWith('0'),
});

export type RegisterUserV2Dto = z.infer<typeof registerUserV2Schema>;
