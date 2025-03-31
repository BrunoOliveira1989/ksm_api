import { db } from '../../db/client'

interface GetAllCustomersParams {
  groupId?: number
}

export const getAllCustomers = async ({ groupId }: GetAllCustomersParams) => {
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
  })

  return { customers }
}
