import { eq, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import { products, sales } from '../../db/schema'

interface GetAllProductsParams {
  groupId?: number
  page: number
}

export const getAllProducts = async ({
  groupId,
  page,
}: GetAllProductsParams) => {
  const allProducts = await db
    .select({
      id: products.id,
      description: products.description,
      unitValue: sql<number>`CAST(${sales.unitValue} AS FLOAT)`,
    })
    .from(products)
    .innerJoin(sales, eq(products.id, sales.productId))
    .where(groupId ? eq(products.groupId, groupId) : undefined)
    .orderBy(products.description)
    .offset((page - 1) * 10)
    .limit(10)

  return {
    products: allProducts,
  }
}
