import { z } from 'zod';

export const createPreferenceSchema = z.object({
  minYear: z.number().int().nullable(),
  maxYear: z.number().int().nullable(),
  minInsuranceDuration: z.number().int().nullable(),
  maxInsuranceDuration: z.number().int().nullable(),
  minMileage: z.number().int().nullable(),
  maxMileage: z.number().int().nullable(),
  minPrice: z.number().int().nullable(),
  maxPrice: z.number().int().nullable(),
  makeId: z.number().int(),
  modelId: z.number().int(),
  stateId: z.number().int(),
  cityId: z.number().int(),
  colorIds: z.array(z.number().int()).optional(),
  gearboxIds: z.array(z.number().int()).optional(),
  fuelTypeIds: z.array(z.number().int()).optional(),
  engineStateIds: z.array(z.number().int()).optional(),
  chassisStateIds: z.array(z.number().int()).optional(),
  bodyStateIds: z.array(z.number().int()).optional(),
});
export const updatePreferenceSchema = createPreferenceSchema.partial();

export type CreatePreferenceDto = z.infer<typeof createPreferenceSchema>;
export type UpdatePreferenceDto = z.infer<typeof updatePreferenceSchema>;
