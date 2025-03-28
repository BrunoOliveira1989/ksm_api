import chalk from 'chalk'

import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { sql } from 'drizzle-orm'
import { db } from '../db/client'
import { env } from '../env'
import { router } from './routes/router'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Kodiak Sales Manager API',
      description:
        'Especificações da API para o backend da aplicação Kodiak Sales Manager',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(router)

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
