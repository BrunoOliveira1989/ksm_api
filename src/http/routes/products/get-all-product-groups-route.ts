import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllProductGroups } from '../../../functions/products/get-all-product-groups'
import { authenticate } from '../../../hook/auth-hook'

export const getAllProductGroupsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/groups',
    {
      schema: {
        summary: 'Get all product groups',
        operationId: 'getAllProductGroups',
        tags: ['Products'],
        response: {
          200: z.object({
            groups: z.array(
              z.object({
                id: z.number(),
                description: z.string(),
              })
            ),
          }),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (_, reply) => {
      const { groups } = await getAllProductGroups()

      if (!groups.length) {
        return reply.status(204).send()
      }

      return {
        groups,
      }
    }
  )
}
