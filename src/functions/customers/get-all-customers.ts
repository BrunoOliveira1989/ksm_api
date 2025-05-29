import { and, eq, ilike, or } from 'drizzle-orm'
import { db } from '../../db/client'
import { customers } from '../../db/schema'

interface GetAllCustomersParams {
  groupId?: number
  page: number
  search?: string
}

export const getAllCustomers = async ({
  groupId,
  page,
  search,
}: GetAllCustomersParams) => {
  const allCustomers = await db.query.customers.findMany({
    columns: {
      id: true,
      companyName: true,
    },
    where: () => {
      return and(
        groupId ? eq(customers.groupId, groupId) : undefined,
        search
          ? or(
              ilike(customers.companyName, `%${search}%`),
              ilike(customers.tradeName, `%${search}%`)
            )
          : undefined
      )
    },
    offset: (page - 1) * 10,
    limit: 10,
  })

  return { customers: allCustomers }
}
