import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllProductGroupsRoute } from './get-all-product-groups'
import { getAllProductsRoute } from './get-all-products-route'
import { getProductByIdRoute } from './get-product-by-id-route'

export const productsRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllProductsRoute)
  await app.register(getAllProductGroupsRoute)
  await app.register(getProductByIdRoute)
}
