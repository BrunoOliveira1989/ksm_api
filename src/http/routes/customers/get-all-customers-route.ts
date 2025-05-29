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
        operationId: 'getAllCustomers',
        tags: ['Customers'],
        querystring: z.object({
          groupId: z.coerce.number().optional(),
          page: z.coerce.number().default(1),
          search: z.ostring(),
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
          204: z.null(),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const { groupId, page, search } = request.query

      const { customers } = await getAllCustomers({ groupId, page, search })

      if (!customers.length) {
        return reply.code(204).send()
      }

      return {
        customers,
      }
    }
  )
}
