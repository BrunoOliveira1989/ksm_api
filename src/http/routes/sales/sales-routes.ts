import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getProductSalesHistoryRoute } from './get-product-sales-history-route'

export const salesRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getProductSalesHistoryRoute)
}
