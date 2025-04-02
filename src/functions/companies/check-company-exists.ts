import { db } from '../../db/client'

export const checkCompanyExists = async (cnpj: string) => {
  const company = await db.query.companies.findFirst({
    where(fields, { like }) {
      return like(fields.cnpj, cnpj)
    },
  })

  return !!company
}
