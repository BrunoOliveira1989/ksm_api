import chalk from 'chalk'
import { sql } from 'drizzle-orm'
import { db } from '../db/client'
import { env } from '../env'
import { buildApp } from './app'

const app = buildApp()

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(async () => {
  await db.execute(sql`SELECT 1`).then(() => {
    console.log(chalk.greenBright('✅ Database connected'))
  })

  console.log(chalk.yellowBright('🔥 HTTP server is running!'))
  console.log(chalk.blueBright(`🌐 Url: ${env.BASE_URL}:${env.PORT}`))
  console.log(
    chalk.whiteBright(`📄 Documentation: ${env.BASE_URL}:${env.PORT}/docs`)
  )
})
