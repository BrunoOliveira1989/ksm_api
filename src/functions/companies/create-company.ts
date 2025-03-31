import { db } from '../../db/client'
import { companies } from '../../db/schema'

interface CreateCompanyRequest {
  cnpj: string
  companyName: string
  tradeName: string
  cep: string
  street: string
  number: number
  complement?: string
  district: string
  city: string
  state: string
}

export const createCompany = async (data: CreateCompanyRequest) => {
  const [{ companyId }] = await db.insert(companies).values(data).returning({
    companyId: companies.id,
  })

  return {
    companyId,
  }
}
