import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getProductById } from '../../../functions/products/get-product-by-id'
import { authenticate } from '../../../hook/auth-hook'

export const getProductByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:id',
    {
      schema: {
        summary: 'Get product by id',
        operationId: 'getProductById',
        tags: ['Products'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            product: z.object({
              id: z.string(),
              description: z.string(),
              groupId: z.number(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const { id } = request.params

      const { product } = await getProductById({
        id,
      })

      if (!product) {
        return reply.code(404).send({ message: 'Produto não encontrado' })
      }

      return {
        product,
      }
    }
  )
}
