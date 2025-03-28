import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  BASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
