import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllProducts } from '../../../functions/products/get-all-products'

export const getAllProductsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '',
    {
      schema: {
        summary: 'Get all products',
        tags: ['Products'],
        querystring: z.object({
          groupId: z.coerce.number().optional(),
          page: z.coerce.number().default(1),
        }),
        response: {
          200: z.object({
            products: z.array(
              z.object({
                id: z.string(),
                description: z.string(),
                unitValue: z.number(),
              })
            ),
          }),
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { groupId, page } = request.query

      const { products } = await getAllProducts({ groupId, page })

      if (!products.length) {
        return reply.status(204).send()
      }

      return {
        products,
      }
    }
  )
}
