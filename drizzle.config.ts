import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
