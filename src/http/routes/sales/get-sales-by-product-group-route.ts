import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getSalesByProductGroup } from '../../../functions/sales/get-sales-by-product-group'
import { authenticate } from '../../../hook/auth-hook'

export const getSalesByProductGroupRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/group',
    {
      schema: {
        summary: 'Get sales grouped by product group',
        operationId: 'getSalesByProductGroup',
        tags: ['Sales'],
        response: {
          200: z.object({
            sales: z.object({
              total: z.number(),
              groupedSales: z.array(
                z.object({
                  groupId: z.number(),
                  groupDescription: z.string(),
                  totalGroupSales: z.number(),
                  totalValueGroupSales: z.number(),
                })
              ),
            }),
          }),
          204: z.null(),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (_, reply) => {
      const { sales } = await getSalesByProductGroup()

      if (!sales) {
        return reply.status(204).send()
      }

      return {
        sales,
      }
    }
  )
}
