import dayjs from 'dayjs'
import { and, asc, count, desc, eq, gte, like, lte, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import { customers, sales } from '../../db/schema'

interface GetProductById {
  id: string
}

export const getProductById = async ({ id }: GetProductById) => {
  const lastDatabaseDate = await db.query.sales.findFirst({
    columns: {
      issueDate: true,
    },
    where: (fields, { like }) => like(fields.productId, id),
    orderBy: (fields, { desc }) => desc(fields.issueDate),
  })

  const currentMonth = dayjs(lastDatabaseDate?.issueDate).endOf('month')
  const endsMonth = currentMonth.toDate()
  const fiveMonthsAgo = currentMonth.subtract(5, 'months').toDate()

  const product = await db.query.products.findFirst({
    columns: {
      id: true,
      description: true,
    },
    with: {
      group: {
        columns: {
          description: true,
        },
      },
    },
    where(fields, { like }) {
      return like(fields.id, id)
    },
  })

  // const priceVariation = await db.query.sales.findMany({
  //   columns: {
  //     unitValue: true,
  //     issueDate: true,
  //   },
  //   where: (fields, { like }) => like(fields.productId, id),
  //   orderBy: (fields, { desc }) => desc(fields.issueDate),
  //   limit: 5,
  // })

  const priceVariation = await db
    .select({
      unitValue: sales.unitValue,
      issueDate: sales.issueDate,
    })
    .from(sales)
    .where(
      and(
        like(sales.productId, id),
        gte(sales.issueDate, fiveMonthsAgo),
        lte(sales.issueDate, endsMonth)
      )
    )
    .orderBy(desc(sales.issueDate))

  const mainBuyers = await db
    .select({
      customer: customers.companyName,
      totalPurchases: count(sales.customerId).as('total_purchases'),
      quantityPurchases: count(sales.quantity).as('quantity_purchases'),
    })
    .from(sales)
    .innerJoin(customers, eq(sales.customerId, customers.id))
    .where(eq(sales.productId, id))
    .groupBy(customers.companyName)
    .orderBy(sql`total_purchases DESC`, sql`quantity_purchases DESC`)
    .limit(5)

  return {
    product,
    priceVariation,
    mainBuyers,
  }
}
