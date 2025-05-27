import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getSalesByDaysOfTheLastWeek } from '../../../functions/sales/get-sales-by-days-of-the-last-week'
import { authenticate } from '../../../hook/auth-hook'

export const getSalesByDaysOfTheLastWeekRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/last/week',
      {
        schema: {
          summary: 'Sales count by days of the last last 7 days',
          operationId: 'getSalesByDaysOfTheLastWeek',
          tags: ['Sales'],
          response: {
            200: z.object({
              salesByDay: z.array(
                z.object({
                  issueDate: z.date(),
                  dayOfWeek: z.string(),
                  salesCount: z.number(),
                })
              ),
            }),
            204: z.null(),
          },
          security: [{ BearerAuth: [] }],
        },
        onResponse: [authenticate],
      },
      async (_, reply) => {
        const { salesByDay } = await getSalesByDaysOfTheLastWeek()

        if (!salesByDay.length) {
          return reply.status(204).send()
        }

        return {
          salesByDay,
        }
      }
    )
  }
