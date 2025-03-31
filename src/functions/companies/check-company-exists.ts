import { db } from '../../db/client'

export const checkCompanyExists = async (cnpj: string) => {
  const company = await db.query.companies.findFirst({
    where(fields, { eq }) {
      return eq(fields.cnpj, cnpj)
    },
  })

  return !!company
}
