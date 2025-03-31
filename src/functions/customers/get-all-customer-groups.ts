import { db } from '../../db/client'

export const getAllCustomerGroups = async () => {
  const groups = await db.query.customerGroups.findMany()

  return {
    groups,
  }
}
