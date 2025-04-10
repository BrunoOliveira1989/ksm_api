import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllCustomerGroups } from '../../../functions/customers/get-all-customer-groups'
import { authenticate } from '../../../hook/auth-hook'

export const getAllCustomerGroupsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/groups',
    {
      schema: {
        summary: 'Get all customer groups',
        operationId: 'getAllCustomerGroups',
        tags: ['Customers'],
        response: {
          200: z.object({
            groups: z.array(
              z.object({
                id: z.number(),
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
      const { groups } = await getAllCustomerGroups()

      if (!groups.length) {
        return reply.status(204).send()
      }

      return {
        groups,
      }
    }
  )
}
