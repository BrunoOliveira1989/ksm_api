import { db } from '../../db/client'

export const getAllProductGroups = async () => {
  const groups = await db.query.productGroups.findMany()

  return {
    groups,
  }
}
