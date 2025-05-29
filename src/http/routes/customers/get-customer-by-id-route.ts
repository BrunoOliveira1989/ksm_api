import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getCustomerById } from '../../../functions/customers/get-customer-by-id'
import { authenticate } from '../../../hook/auth-hook'

export const getCustomerByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:id',
    {
      schema: {
        summary: 'Get customer by id',
        operationId: 'getCustomerById',
        tags: ['Customers'],
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            customer: z.object({
              companyName: z.string(),
              tradeName: z.string(),
              group: z.string(),
              city: z.string(),
              state: z.string(),
            }),
            lastSales: z.array(
              z.object({
                productId: z.string(),
                productDescription: z.string(),
                quantity: z.number(),
                total: z.number(),
                date: z.date(),
              })
            ),
            totalPurchasePerMonth: z.array(
              z.object({
                year: z.string(),
                month: z.string(),
                totalQuantity: z.number(),
                totalPuchases: z.number(),
              })
            ),
          }),
          404: z.object({ message: z.string() }),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const { id } = request.params

      const { customer, lastSales, totalPurchasePerMonth } =
        await getCustomerById(id)

      if (!customer) {
        return reply.code(404).send({ message: 'Cliente não encontrado!' })
      }

      return { customer, lastSales, totalPurchasePerMonth }
    }
  )
}
