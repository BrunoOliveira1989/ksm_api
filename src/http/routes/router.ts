import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authRoutes } from './auth/auth-routes'
import { healthCheck } from './health-check'

export const router: FastifyPluginAsyncZod = async app => {
  await app.register(healthCheck)
  await app.register(authRoutes, { prefix: '/auth' })
}
