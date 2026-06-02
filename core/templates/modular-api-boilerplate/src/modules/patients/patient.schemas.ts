import { z } from 'zod';

export const patientIdSchema = z.object({
  id: z.string().min(1),
});

export const patientSchema = z.object({
  name: z.string().min(1),
  birth_date: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
});
