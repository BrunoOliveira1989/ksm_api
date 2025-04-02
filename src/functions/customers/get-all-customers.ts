import { eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { customers } from '../../db/schema'

interface GetAllCustomersParams {
  groupId?: number
  page: number
}

export const getAllCustomers = async ({
  groupId,
  page,
}: GetAllCustomersParams) => {
  const allCustomers = await db.query.customers.findMany({
    columns: {
      id: true,
      companyName: true,
    },
    where: () => {
      return groupId ? eq(customers.groupId, groupId) : undefined
    },
    offset: (page - 1) * 10,
    limit: 10,
  })

  return { customers: allCustomers }
}
