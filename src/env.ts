import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  BASE_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
