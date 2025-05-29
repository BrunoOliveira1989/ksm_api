import { desc, eq, sql, sum } from 'drizzle-orm'
import { db } from '../../db/client'
import { customerGroups, customers, products, sales } from '../../db/schema'

export const getCustomerById = async (id: number) => {
  const filter = eq(sales.customerId, id)

  const { customer, lastSales, totalPurchasePerMonth } = await db.transaction(
    async tx => {
      const [customer] = await tx
        .select({
          companyName: customers.companyName,
          tradeName: customers.tradeName,
          group: customerGroups.description,
          city: customers.city,
          state: customers.state,
        })
        .from(customers)
        .innerJoin(customerGroups, eq(customers.groupId, customerGroups.id))
        .where(eq(customers.id, id))

      const lastSales = await tx
        .select({
          productId: products.id,
          productDescription: products.description,
          quantity:
            sql<number>`COALESCE(CAST(${sales.quantity} AS FLOAT), 0)`.as(
              'quantity'
            ),
          total: sql<number>`COALESCE(CAST(${sales.total} AS FLOAT), 0)`.as(
            'total'
          ),
          date: sales.issueDate,
        })
        .from(sales)
        .innerJoin(products, eq(sales.productId, products.id))
        .where(filter)
        .orderBy(desc(sales.issueDate))
        .limit(3)

      const totalPurchasePerMonth = await tx
        .select({
          year: sql<string>`EXTRACT(YEAR FROM ${sales.issueDate})`.as('year'),
          month: sql<string>`EXTRACT(MONTH FROM ${sales.issueDate})`.as(
            'month'
          ),
          totalQuantity:
            sql<number>`COALESCE(CAST(SUM(${sales.quantity}) AS FLOAT), 0)`.as(
              'total_quantity'
            ),
          totalPuchases:
            sql<number>`COALESCE(CAST(SUM(${sales.total}) AS FLOAT), 0)`.as(
              'total_purchases'
            ),
        })
        .from(sales)
        .where(filter)
        .groupBy(
          sql`EXTRACT(YEAR FROM ${sales.issueDate}), EXTRACT(MONTH FROM ${sales.issueDate})`
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${sales.issueDate})`,
          sql`EXTRACT(MONTH FROM ${sales.issueDate})`
        )
        .limit(6)
      return { customer, lastSales, totalPurchasePerMonth }
    }
  )

  return { customer, lastSales, totalPurchasePerMonth }
}
