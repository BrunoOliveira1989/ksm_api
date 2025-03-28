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

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(chalk.greenBright('✅ HTTP server is running!'))
  console.log(chalk.blue(`🌐 Url: ${env.BASE_URL}:${env.PORT}`))
  console.log(chalk.bold(`📄 Documentation: ${env.BASE_URL}:${env.PORT}/docs`))
})
