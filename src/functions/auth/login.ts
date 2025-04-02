import { db } from '../../db/client'

export const login = async (email: string) => {
  const user = await db.query.users.findFirst({
    with: {
      company: {
        columns: {
          tradeName: true,
        },
      },
    },
    where(fields, { like }) {
      return like(fields.email, email)
    },
  })

  return {
    user,
  }
}
