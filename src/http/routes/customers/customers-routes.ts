import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllCustomerGroupsRoute } from './get-all-customer-groups-route'
import { getAllCustomersRoute } from './get-all-customers-route'
import { getCustomerByIdRoute } from './get-customer-by-id-route'
import { getCustomersNamesRoute } from './get-customers-names-route'

export const customersRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllCustomersRoute)
  await app.register(getAllCustomerGroupsRoute)
  await app.register(getCustomerByIdRoute)
  await app.register(getCustomersNamesRoute)
}
