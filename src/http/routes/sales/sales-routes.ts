import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getLastTenSalesRoute } from './get-last-ten-sale-route'
import { getProductSalesHistoryRoute } from './get-product-sales-history-route'
import { getSalesByDaysOfTheLastWeekRoute } from './get-sales-by-days-of-the-last-week-route'
import { getSalesByProductGroupRoute } from './get-sales-by-product-group-route'

export const salesRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getProductSalesHistoryRoute)
  await app.register(getSalesByDaysOfTheLastWeekRoute)
  await app.register(getSalesByProductGroupRoute)
  await app.register(getLastTenSalesRoute)
}
