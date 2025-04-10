import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAllProductGroupsRoute } from './get-all-product-groups-route'
import { getAllProductsRoute } from './get-all-products-route'
import { getProductByIdRoute } from './get-product-by-id-route'
import { getTopSellingProductsRoute } from './get-top-selling-products-route'
import { getTotalDistinctProductsSoldByDayOfTheLastWeekRoute } from './get-total-distinct-products-sold-by-day-of-the-last-week-route'

export const productsRoutes: FastifyPluginAsyncZod = async app => {
  await app.register(getAllProductsRoute)
  await app.register(getAllProductGroupsRoute)
  await app.register(getProductByIdRoute)
  await app.register(getTopSellingProductsRoute)
  await app.register(getTotalDistinctProductsSoldByDayOfTheLastWeekRoute)
}
