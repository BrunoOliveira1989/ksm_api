import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const healthCheck: FastifyPluginAsyncZod = async app => {
  app.get(
    '/',
    {
      schema: {
        summary: 'Health check from api',
        operationId: 'healthCheck',
        tags: ['Health check'],
        response: {
          200: z.object({
            status: z.string(),
          }),
        },
      },
    },
    async () => {
      return {
        status: 'API Ok!',
      }
    }
  )
}
