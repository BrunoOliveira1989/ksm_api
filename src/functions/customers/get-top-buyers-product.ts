import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import { customers, sales } from '../../db/schema'

interface GetTopBuyersProductParams {
  id: string
}

export const getTopBuyersProduct = async ({
  id,
}: GetTopBuyersProductParams) => {
  const topBuyers = await db
    .select({
      customerId: sales.customerId,
      totalProductsPurchased:
        sql<number>`CAST(sum(${sales.quantity}) AS FLOAT)`.as(
          'total_products_purchased'
        ),
      totalPurchases: sql<number>`CAST(sum(${sales.id}) AS FLOAT)`.as(
        'total_purchases'
      ),
      totalValue: sql<number>`CAST(sum(${sales.total}) AS FLOAT)`.as(
        'total_value'
      ),
      companyName: customers.companyName,
    })
    .from(sales)
    .innerJoin(customers, eq(sales.customerId, customers.id))
    .where(eq(sales.productId, id))
    .groupBy(sales.customerId, customers.companyName)
    .orderBy(desc(sql`total_products_purchased`))
    .limit(10)

  return {
    topBuyers,
  }
}
