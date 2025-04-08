import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import { productGroups, products, sales } from '../../db/schema'

export const getSalesByProductGroup = async () => {
  const report = await db.transaction(async tx => {
    const [{ totalSales }] = await tx
      .select({
        totalSales: sql<number>`CAST(count(${sales.id}) AS INT)`.as(
          'total_sales'
        ),
      })
      .from(sales)

    const groupedSales = await tx
      .select({
        groupId: products.groupId,
        groupDescription: productGroups.description,
        totalGroupSales: sql<number>`CAST(count(${sales.id}) AS INT)`.as(
          'total_group_sales'
        ),
        totalValueGroupSales:
          sql<number>`CAST(sum(${sales.total}) AS FLOAT)`.as(
            'total_value_group_sales'
          ),
      })
      .from(sales)
      .innerJoin(products, eq(sales.productId, products.id))
      .innerJoin(productGroups, eq(products.groupId, productGroups.id))
      .groupBy(products.groupId, productGroups.description)
      .orderBy(desc(sql`total_group_sales`))

    return {
      total: totalSales,
      groupedSales,
    }
  })

  return {
    sales: report,
  }
}
