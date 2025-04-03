import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { loginRoute } from './login-route'
import { logoutRoute } from './logout-route'

export const authRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(loginRoute)
  // await app.register(logoutRoute)
}
