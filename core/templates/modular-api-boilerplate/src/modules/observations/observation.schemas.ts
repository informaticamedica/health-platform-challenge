import { z } from 'zod';

export const observationIdSchema = z.object({
  id: z.string().min(1),
});

export const observationCategories = [
  'social-history',
  'vital-signs',
  'imaging',
  'laboratory',
  'procedure',
  'survey',
  'exam',
  'therapy',
  'activity',
] as const;

export const observationSchema = z.object({
  code: z.string().min(3).max(100),
  value: z.union([z.string().min(1).max(500), z.number().min(0)]),
  date: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  status: z.enum(['final', 'preliminary', '']).default('final'),
  category: z.enum(observationCategories),
  components: z
    .array(
      z.object({
        code: z.string().min(1).max(100),
        value: z.number().min(0),
        unit: z.string().min(1).max(50),
      }),
    )
    .optional(),
});
