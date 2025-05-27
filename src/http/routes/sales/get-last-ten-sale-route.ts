import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLastTenSales } from '../../../functions/sales/get-last-ten-sales'
import { authenticate } from '../../../hook/auth-hook'

export const getLastTenSalesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/last/ten',
    {
      schema: {
        summary: 'Get the last ten sales',
        operationId: 'getLastTenSales',
        tags: ['Sales'],
        response: {
          200: z.object({
            lastSales: z.array(
              z.object({
                id: z.number(),
                issueDate: z.date(),
                quantity: z.string(),
                total: z.string(),
                companyName: z.string(),
                description: z.string(),
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
      const { sales } = await getLastTenSales()

      if (!sales.length) {
        return reply.status(204).send()
      }

      const lastSales = sales.map(({ customer, product, ...sale }) => {
        return {
          companyName: customer.companyName,
          description: product.description,
          ...sale,
        }
      })

      return {
        lastSales,
      }
    }
  )
}
