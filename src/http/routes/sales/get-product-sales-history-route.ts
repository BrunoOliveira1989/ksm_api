import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getProductSalesHistory } from '../../../functions/sales/get-product-sales-history'
import { authenticate } from '../../../hook/auth-hook'

export const getProductSalesHistoryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/products/history/:id',
    {
      schema: {
        summary: 'Get products sales history',
        operationId: 'getProductSalesHistory',
        tags: ['Sales'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            history: z.array(
              z.object({
                year: z.number(),
                month: z.number(),
                countSales: z.number(),
                totalUnitSales: z.number(),
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

      const { history } = await getProductSalesHistory({ id })

      if (!history.length) {
        return reply.status(204).send()
      }

      return {
        history,
      }
    }
  )
}
