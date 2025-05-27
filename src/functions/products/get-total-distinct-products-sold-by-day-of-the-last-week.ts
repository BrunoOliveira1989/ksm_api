import dayjs from 'dayjs'
import { asc, count, gte, max, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import { sales } from '../../db/schema'

export const getTotalDistinctProductsSoldByDayOfTheLastWeek = async () => {
  const [{ maxIssueDate }] = await db
    .select({
      maxIssueDate: max(sales.issueDate).as('max_issue_date'),
    })
    .from(sales)

  if (!maxIssueDate) return { salesByDay: [] }

  const sevenDaysAgo = dayjs(maxIssueDate).subtract(7, 'days').toDate()

  const salesByDay = await db
    .select({
      issueDate: sales.issueDate,
      dayOfWeek: sql<string> /* sql */`CASE 
          WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 0 THEN 'Domingo'
          WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 1 THEN 'Segunda-feira'
          WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 2 THEN 'Terça-feira'
          WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 3 THEN 'Quarta-feira'
          WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 4 THEN 'Quinta-feira'
          WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 5 THEN 'Sexta-feira'
          WHEN EXTRACT(DOW FROM ${sales.issueDate}) = 6 THEN 'Sábado'
        END`.as('days_of_week'),
      productsCount: sql<number>`CAST(sum(sales.quantity) AS INT)`.as(
        'products_count'
      ),
      productsDistinctCount: count(sales.productId).as(
        'products_distinct_count'
      ),
    })
    .from(sales)
    .where(gte(sales.issueDate, sevenDaysAgo))
    .groupBy(sales.issueDate)
    .orderBy(asc(sales.issueDate))

  return {
    salesByDay,
  }
}
