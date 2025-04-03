import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticate } from '../../../hook/auth-hook'

export const logoutRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/logout',
    {
      schema: {
        summary: 'Logout',
        operationId: 'logout',
        tags: ['Authentication'],
        response: {
          204: z.null(),
          401: z.object({
            message: z.string(),
          }),
        },
        security: [{ CookieAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (_, reply) => {
      // reply.clearCookie('token').status(204)
    }
  )
}
