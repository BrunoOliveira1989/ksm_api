import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticate } from '../../../hook/auth-hook'

export const checkAuthenticateRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/check',
    {
      schema: {
        summary: 'Check user authentication',
        operationId: 'checkAuthentication',
        tags: ['Authentication'],
        response: {
          204: z.null(),
          401: z.object({
            message: z.string(),
          }),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (_, reply) => {
      return reply.status(204).send()
    }
  )
}
