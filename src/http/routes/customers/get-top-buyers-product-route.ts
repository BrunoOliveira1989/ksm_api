import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getTopBuyersProduct } from '../../../functions/customers/get-top-buyers-product'
import { authenticate } from '../../../hook/auth-hook'

export const getTopBuyersProductRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/top/:id',
    {
      schema: {
        summary: 'Get top 10 buyers of a product',
        operationId: 'getTopBuyersProduct',
        tags: ['Customers'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            topBuyers: z.array(
              z.object({
                customerId: z.number(),
                totalProductsPurchased: z.number(),
                totalPurchases: z.number(),
                totalValue: z.number(),
                companyName: z.string(),
              })
            ),
          }),
          204: z.null(),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const { id } = request.params

      const { topBuyers } = await getTopBuyersProduct({ id })

      if (!topBuyers.length) {
        return reply.status(204).send()
      }

      return {
        topBuyers,
      }
    }
  )
}
