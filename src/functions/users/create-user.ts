import { db } from '../../db/client'
import { users } from '../../db/schema'

interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: 'administrador' | 'vendedor'
  companyId: string
}

export const createUser = async (data: CreateUserRequest) => {
  const [{ userId }] = await db.insert(users).values(data).returning({
    userId: users.id,
  })

  return {
    userId,
  }
}
