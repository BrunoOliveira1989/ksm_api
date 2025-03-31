import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllProductsRoute } from './get-all-products-route'

export const productsRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllProductsRoute)
}
