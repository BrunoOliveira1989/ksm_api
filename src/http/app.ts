import fastifyCors from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
// import { fastifyCookie } from '@fastify/cookie'

import { env } from '../env'
import { router } from './routes/router'

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifyCors, {
    origin: true,
  })

  app.register(fastifyJwt, {
    secret: env.SECRET,
    // cookie: {
    //   cookieName: 'token',
    //   signed: false,
    // },
    sign: {
      expiresIn: '8h',
    },
  })

  // app.register(fastifyCookie)

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Kodiak Sales Manager API',
        description:
          'Especificações da API para o backend da aplicação Kodiak Sales Manager',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'apiKey',
            name: 'authorization',
            in: 'header',
          },
          // CookieAuth: {
          //   type: 'apiKey',
          //   in: 'cookie',
          //   name: 'token',
          //   description: 'JWToken in HTTP-Only cookie',
          // },
        },
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  app.register(router)

  return app
}
