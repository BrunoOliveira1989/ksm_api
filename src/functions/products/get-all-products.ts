import { and, eq, ilike, or } from 'drizzle-orm'
import { db } from '../../db/client'
import { products, sales } from '../../db/schema'

interface GetAllProductsParams {
  groupId?: number
  page: number
  search?: string
}

export const getAllProducts = async ({
  groupId,
  page,
  search,
}: GetAllProductsParams) => {
  const allProducts = await db
    .select({
      id: products.id,
      description: products.description,
    })
    .from(products)
    .where(
      and(
        groupId ? eq(products.groupId, groupId) : undefined,
        search
          ? or(
              ilike(products.id, `%${search}%`),
              ilike(products.description, `%${search}%`)
            )
          : undefined
      )
    )
    .groupBy(products.id, products.description)
    .orderBy(products.description)
    .offset((page - 1) * 10)
    .limit(10)

  return {
    products: allProducts,
  }
}
