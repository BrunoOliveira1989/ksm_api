import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import { products, sales } from '../../db/schema'

export const getTopSellingProducts = async () => {
  const topProducts = await db
    .select({
      id: sales.productId,
      description: products.description,
      totalSelling: sql<number>`CAST(sum(${sales.quantity}) AS FLOAT)`.as(
        'total_selling'
      ),
      totalSalesValue: sql<number>`CAST(sum(${sales.total}) AS FLOAT)`.as(
        'total_sales_value'
      ),
    })
    .from(sales)
    .innerJoin(products, eq(sales.productId, products.id))
    .groupBy(sales.productId, products.description)
    .orderBy(desc(sql`total_selling`))
    .limit(10)

  return {
    topProducts,
  }
}
