import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { loginRoute } from './login'

export const authRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(loginRoute)
}
