import { db } from '../../db/client'

export const getLastTenSales = async () => {
  const sales = await db.query.sales.findMany({
    columns: {
      id: true,
      total: true,
      issueDate: true,
      quantity: true,
    },
    with: {
      product: {
        columns: {
          description: true,
        },
      },
      customer: {
        columns: {
          companyName: true,
        },
      },
    },
    orderBy: (fields, { desc }) => desc(fields.issueDate),
    limit: 10,
  })

  return {
    sales,
  }
}
