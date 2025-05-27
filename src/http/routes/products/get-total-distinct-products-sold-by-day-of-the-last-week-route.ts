import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getTotalDistinctProductsSoldByDayOfTheLastWeek } from '../../../functions/products/get-total-distinct-products-sold-by-day-of-the-last-week'
import { authenticate } from '../../../hook/auth-hook'

export const getTotalDistinctProductsSoldByDayOfTheLastWeekRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/count/last/week',
      {
        schema: {
          summary:
            'Get the count of distinct products by day of the last 7 days',
          operationId: 'getTotalDistinctProductsSoldByDayOfTheLastWeekRoute',
          tags: ['Products'],
          response: {
            200: z.object({
              salesByDay: z.array(
                z.object({
                  issueDate: z.date(),
                  dayOfWeek: z.string(),
                  productsCount: z.number(),
                  productsDistinctCount: z.number(),
                })
              ),
            }),
            204: z.null(),
          },
          security: [{ BearerAuth: [] }],
        },
        onRequest: [authenticate],
      },
      async (_, reply) => {
        const { salesByDay } =
          await getTotalDistinctProductsSoldByDayOfTheLastWeek()

        if (!salesByDay.length) {
          return reply.status(204).send()
        }

        return {
          salesByDay,
        }
      }
    )
  }
