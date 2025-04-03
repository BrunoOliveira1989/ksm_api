import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getTopSellingProducts } from '../../../functions/products/get-top-selling-products'
import { authenticate } from '../../../hook/auth-hook'

export const getTopSellingProductsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/top/selling',
    {
      schema: {
        summary: 'Get top 10 selling products',
        operationId: 'getTopSellingProducts',
        tags: ['Products'],
        response: {
          200: z.object({
            topProducts: z.array(
              z.object({
                id: z.string(),
                description: z.string(),
                totalSelling: z.number(),
                totalSalesValue: z.number(),
              })
            ),
          }),
          204: z.null(),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (_, reply) => {
      const { topProducts } = await getTopSellingProducts()

      if (!topProducts.length) {
        return reply.status(204).send()
      }
      return {
        topProducts,
      }
    }
  )
}
