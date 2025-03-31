import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authRoutes } from './auth/auth-routes'
import { companiesRoutes } from './companies/companies-routes'
import { customersRoutes } from './customers/customers-routes'
import { healthCheck } from './health-check'
import { productsRoutes } from './products/products-routes'
import { salesRoutes } from './sales/sales-routes'
import { usersRoutes } from './users/users-routes'

export const router: FastifyPluginAsyncZod = async app => {
  await app.register(healthCheck)
  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(usersRoutes, { prefix: '/users' })
  await app.register(companiesRoutes, { prefix: '/companies' })
  await app.register(customersRoutes, { prefix: '/customers' })
  await app.register(productsRoutes, { prefix: '/products' })
  await app.register(salesRoutes, { prefix: '/sales' })
}
