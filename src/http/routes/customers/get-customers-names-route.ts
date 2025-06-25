import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getCustomersNames } from '../../../functions/customers/get-customers-names'
import { authenticate } from '../../../hook/auth-hook'

export const getCustomersNamesRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/names',
    {
      schema: {
        summary: 'Get customers names',
        tags: ['Customers'],
        operationId: 'getCustomersNames',
        body: z.object({
          ids: z.array(z.number()),
        }),
        response: {
          200: z.object({
            names: z.array(
              z.object({
                id: z.number(),
                companyName: z.string(),
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
      const { ids } = request.body

      const { names } = await getCustomersNames(ids)

      if (!names.length) {
        return reply.code(404).send({ message: 'Nenhum nome encontrado' })
      }

      return {
        names,
      }
    }
  )
}
