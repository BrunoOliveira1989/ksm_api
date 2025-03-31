import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllCustomersRoute } from './get-all-customers-route'

export const customersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllCustomersRoute)
}
