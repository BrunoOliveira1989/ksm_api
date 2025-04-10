import { db } from '../../db/client'

export const checkUserExists = async (email: string) => {
  const user = await db.query.users.findFirst({
    where(fields, { like }) {
      return like(fields.email, email)
    },
  })

  return !!user
}
