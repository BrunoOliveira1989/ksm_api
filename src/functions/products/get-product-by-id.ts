import { db } from '../../db/client'

interface GetProductById {
  id: string
}

export const getProductById = async ({ id }: GetProductById) => {
  const product = await db.query.products.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, id)
    },
  })

  return {
    product,
  }
}
