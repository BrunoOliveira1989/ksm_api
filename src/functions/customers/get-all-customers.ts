import { db } from '../../db/client'

interface GetAllCustomersParams {
  groupId?: number
  page: number
}

export const getAllCustomers = async ({
  groupId,
  page,
}: GetAllCustomersParams) => {
  const customers = await db.query.customers.findMany({
    columns: {
      id: true,
      companyName: true,
    },
    where(fields, { eq }) {
      if (groupId) {
        return eq(fields.groupId, groupId)
      }
    },
    offset: (page - 1) * 10,
    limit: 10,
  })

  return { customers }
}
