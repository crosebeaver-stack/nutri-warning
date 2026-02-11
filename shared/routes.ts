import { z } from 'zod';

export const nutritionLevelSchema = z.enum(['low', 'moderate', 'high']);
export type NutritionLevel = z.infer<typeof nutritionLevelSchema>;

export const foodItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  calories: z.number(),
  fat: z.number(),
  sugar: z.number(),
  salt: z.number(),
  image: z.string().optional(),
  country: z.string().optional(),
  trafficLight: z.object({
    fat: nutritionLevelSchema,
    sugar: nutritionLevelSchema,
    salt: nutritionLevelSchema,
    calories: nutritionLevelSchema,
  }),
  exerciseEquivalent: z.object({
    runningMinutes: z.number(),
    walkingMinutes: z.number(),
  }),
});

export type FoodItem = z.infer<typeof foodItemSchema>;

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  food: {
    search: {
      method: 'GET' as const,
      path: '/api/food/search' as const,
      input: z.object({
        q: z.string().min(1, "Search term is required"),
      }),
      responses: {
        200: z.array(foodItemSchema),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    compare: {
      method: 'GET' as const,
      path: '/api/food/:id/compare' as const,
      responses: {
        200: z.object({
          original: foodItemSchema,
          variants: z.array(foodItemSchema),
        }),
        404: z.object({ message: z.string() }),
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
