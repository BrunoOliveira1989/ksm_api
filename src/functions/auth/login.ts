import { db } from '../../db/client'

export const login = async (email: string) => {
  const user = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.email, email)
    },
  })

  return {
    user,
  }
}
