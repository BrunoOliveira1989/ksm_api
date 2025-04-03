import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
// import { logoutRoute } from './logout-route'
import { checkAuthenticateRoute } from './check-authenticate'
import { loginRoute } from './login-route'

export const authRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(loginRoute)
  await app.register(checkAuthenticateRoute)
  // await app.register(logoutRoute)
}
