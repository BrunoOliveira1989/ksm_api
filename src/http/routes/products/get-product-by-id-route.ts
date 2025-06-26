import dayjs from 'dayjs'
import 'dayjs/locale/pt-br.js'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getProductById } from '../../../functions/products/get-product-by-id'
import { authenticate } from '../../../hook/auth-hook'

dayjs.locale('pt-br')

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
              groupDescription: z.string(),
              priceVariation: z.array(
                z.object({
                  month: z.string(),
                  average: z.number(),
                })
              ),
              mainBuyers: z.array(
                z.object({
                  customer: z.string(),
                  totalPurchases: z.number(),
                  quantityPurchases: z.number(),
                })
              ),
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

      const { product, priceVariation, mainBuyers } = await getProductById({
        id,
      })

      if (!product) {
        return reply.code(404).send({ message: 'Produto não encontrado' })
      }

      const { group, ...rest } = product

      const groupedByMonth: Record<
        string,
        {
          unitValue: string
          issueDate: Date
        }[]
      > = {}

      for (const entry of priceVariation) {
        const monthKey = dayjs(entry.issueDate).format('MMM')

        if (!groupedByMonth[monthKey]) {
          groupedByMonth[monthKey] = []
        }

        groupedByMonth[monthKey].push(entry)
      }

      const monthsRange: string[] = []
      if (priceVariation.length > 0) {
        const start = dayjs(priceVariation[0].issueDate).startOf('month')
        const end = dayjs(
          priceVariation[priceVariation.length - 1].issueDate
        ).startOf('month')
        let current = start

        while (current.isAfter(end) || current.isSame(end)) {
          monthsRange.push(current.format('MMM'))
          current = current.subtract(1, 'month')
        }
      }

      const variations = monthsRange.map(month => {
        const entries = groupedByMonth[month] || []

        let average: number
        if (entries.length === 0) {
          average = 0
        } else {
          const total = entries.reduce(
            (acc, entry) => acc + Number(entry.unitValue),
            0
          )
          average = total / entries.length
        }

        return {
          month,
          average: Number(average.toFixed(2)),
        }
      })

      // const variations = priceVariation.map(variation => ({
      //   issueDate: dayjs(variation.issueDate).format('DD/MM/YYYY'),
      //   unitValue: Number(variation.unitValue),
      // }))

      return {
        product: {
          ...rest,
          groupDescription: group.description,
          priceVariation: variations.reverse(),
          mainBuyers,
        },
      }
    }
  )
}
