import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllProducts } from '../../../functions/products/get-all-products'
import { authenticate } from '../../../hook/auth-hook'

export const getAllProductsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '',
    {
      schema: {
        summary: 'Get all products',
        operationId: 'getAllProduct',
        tags: ['Products'],
        querystring: z.object({
          groupId: z.coerce.number().optional(),
          page: z.coerce.number().default(1),
          search: z.string().optional(),
        }),
        response: {
          200: z.object({
            products: z.array(
              z.object({
                id: z.string(),
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
    async (request, reply) => {
      const { groupId, page, search } = request.query

      const { products } = await getAllProducts({ groupId, page, search })

      if (!products.length) {
        return reply.status(204).send()
      }

      return {
        products,
      }
    }
  )
}
