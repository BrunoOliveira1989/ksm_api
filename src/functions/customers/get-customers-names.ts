import { inArray } from 'drizzle-orm'
import { db } from '../../db/client'
import { customers } from '../../db/schema'

export const getCustomersNames = async (ids: number[]) => {
  const names = await db
    .select({
      id: customers.id,
      companyName: customers.companyName,
    })
    .from(customers)
    .where(inArray(customers.id, ids))

  return { names }
}
