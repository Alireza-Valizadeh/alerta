import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(1).max(150),
  makeId: z.number().int().positive(), // Expect the ID of the Make
  modelId: z.number().int().positive(), // Expect the ID of the Model
  year: z.number().int().min(1000).max(2030),
  colorId: z.number().int().positive(), // Expect the ID of the Color
  mileage: z.number().int().min(0),
  stateId: z.number().int().positive(), // Expect the ID of the State
  cityId: z.number().int().positive(), // Expect the ID of the City
  insuranceDuration: z.number().int().min(0),
  gearboxId: z.number().int().positive(), // Expect the ID of the Gearbox
  fuelTypeId: z.number().int().positive(), // Expect the ID of the FuelType
  price: z.number().min(0),
  engineStateId: z.number().int().positive(), // Expect the ID of the EngineState
  chassisStateId: z.number().int().positive(), // Expect the ID of the ChassisState
  bodyStateId: z.number().int().positive(), // Expect the ID of the BodyState
  description: z.string().max(200).optional(),
  isApproved: z.boolean().default(false),
  isSold: z.boolean().default(false),
});

export type CreateListingDto = z.infer<typeof createListingSchema>;
