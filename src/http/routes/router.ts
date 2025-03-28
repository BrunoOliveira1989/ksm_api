import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { healthCheck } from './health-check'

export const router: FastifyPluginAsyncZod = async app => {
  await app.register(healthCheck)
}
