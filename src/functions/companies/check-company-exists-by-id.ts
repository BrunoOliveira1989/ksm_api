import { db } from '../../db/client'

export const checkCompanyExistsById = async (companyId: string) => {
  const company = await db.query.companies.findFirst({
    where(fields, { like }) {
      return like(fields.id, companyId)
    },
  })

  return !!company
}
