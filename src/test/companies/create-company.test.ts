jest.mock('../../functions/companies/create-company', () => ({
  createCompany: jest.fn(),
}))

jest.mock('../../functions/companies/check-company-exists', () => ({
  checkCompanyExists: jest.fn(),
}))

import { checkCompanyExists as mockedCheckCompanyExists } from '../../functions/companies/check-company-exists'
import { createCompany as mockedCreateCompany } from '../../functions/companies/create-company'
import { buildApp } from '../../http/app'

describe('Create company route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 400 se a empresa já está cadastrada', async () => {
    ;(mockedCheckCompanyExists as jest.Mock).mockResolvedValueOnce(true)

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'POST',
      url: '/companies',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        cnpj: '00000000000000',
        companyName: 'Empresa',
        tradeName: 'Empresa',
        cep: '00000000',
        street: 'Rua',
        number: '0',
        district: 'Bairro',
        city: 'Cidade',
        state: 'UF',
      },
    })

    expect(response.statusCode).toBe(400)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('message')
    expect(payload.message).toEqual('Empresa já cadastrada!')
  })

  it('Retorna 201 e o id da empresa cadastrada em caso de sucesso no cadastro', async () => {
    const fakeCompanyId = '01h5bx9p1v3j8tn80p0x9kr8i'
    ;(mockedCheckCompanyExists as jest.Mock).mockResolvedValueOnce(false)
    ;(mockedCreateCompany as jest.Mock).mockResolvedValueOnce({
      companyId: fakeCompanyId,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'POST',
      url: '/companies',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        cnpj: '00000000000000',
        companyName: 'Empresa',
        tradeName: 'Empresa',
        cep: '00000000',
        street: 'Rua',
        number: '0',
        district: 'Bairro',
        city: 'Cidade',
        state: 'UF',
      },
    })

    expect(response.statusCode).toBe(201)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('companyId')
    expect(payload.companyId).toEqual(fakeCompanyId)
  })
})
