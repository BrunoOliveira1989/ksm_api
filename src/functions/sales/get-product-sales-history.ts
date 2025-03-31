import { eq, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import { sales } from '../../db/schema'

interface GetProductSalesHistoryParams {
  id: string
}

export const getProductSalesHistory = async ({
  id,
}: GetProductSalesHistoryParams) => {
  const history = await db
    .select({
      year: sql<number>`CAST(extract(year from ${sales.issueDate}) AS INT)`.as(
        'year'
      ),
      month:
        sql<number>`CAST(extract(month from ${sales.issueDate}) AS INT)`.as(
          'month'
        ),
      countSales: sql<number>`CAST(count(${sales.id}) AS FLOAT)`.as(
        'count_sales'
      ),
      totalUnitSales: sql<number>`CAST(sum(${sales.quantity}) AS FLOAT)`.as(
        'total_unit_sales'
      ),
    })
    .from(sales)
    .where(eq(sales.productId, id))
    .groupBy(sql`year, month`)
    .orderBy(sql`year, month`)

  return {
    history,
  }
}
