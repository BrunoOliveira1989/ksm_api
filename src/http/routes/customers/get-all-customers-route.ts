import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllCustomers } from '../../../functions/customers/get-all-customers'
import { authenticate } from '../../../hook/auth-hook'

export const getAllCustomersRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '',
    {
      schema: {
        summary: 'Get all customers',
        tags: ['Customers'],
        querystring: z.object({
          groupId: z.coerce.number().optional(),
        }),
        response: {
          200: z.object({
            customers: z.array(
              z.object({
                id: z.number(),
                companyName: z.string(),
              })
            ),
          }),
          204: z.undefined(),
        },
        security: [{ CookieAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const { groupId } = request.query

      const { customers } = await getAllCustomers({ groupId })

      if (!customers.length) {
        return reply.code(204).send()
      }

      return {
        customers,
      }
    }
  )
}
