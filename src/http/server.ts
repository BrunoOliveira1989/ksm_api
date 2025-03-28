import chalk from 'chalk'
import { fastify } from 'fastify'
import { env } from '../env'

const app = fastify()

app.get('/', async () => {
  return {
    status: 'API ok!',
  }
})

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(chalk.greenBright('✔️  HTTP server is running!'))
  console.log(chalk.blue(`🌐 http://localhost:${env.PORT}`))
})
