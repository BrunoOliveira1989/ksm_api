import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllCustomerGroupsRoute } from './get-all-customer-groups-route'
import { getAllCustomersRoute } from './get-all-customers-route'
import { getTopBuyersProductRoute } from './get-top-buyers-product-route'

export const customersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllCustomersRoute)
  await app.register(getAllCustomerGroupsRoute)
  await app.register(getTopBuyersProductRoute)
}
