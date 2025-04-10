jest.mock('../../functions/sales/get-last-ten-sales', () => ({
  getLastTenSales: jest.fn(),
}))

import { getLastTenSales as mockedGetLastTenSales } from '../../functions/sales/get-last-ten-sales'
import { buildApp } from '../../http/app'

describe('Get last ten sales route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetLastTenSales as jest.Mock).mockResolvedValueOnce({
      sales: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/sales/last/ten',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e as 10 última vendas', async () => {
    const fakeSales = [
      {
        id: 1,
        issueDate: '2025-04-10',
        quantity: '10',
        total: '104.99',
        customer: {
          companyName: 'Empresa 01',
        },
        product: {
          description: 'Produto 01',
        },
      },
      {
        id: 2,
        issueDate: '2025-04-10',
        quantity: '2',
        total: '500.0',
        customer: {
          companyName: 'Empresa 02',
        },
        product: {
          description: 'Produto 02',
        },
      },
    ]
    ;(mockedGetLastTenSales as jest.Mock).mockResolvedValueOnce({
      sales: fakeSales,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/sales/last/ten',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('lastSales')
    expect(payload.lastSales).toEqual([
      {
        id: 1,
        issueDate: '2025-04-10',
        quantity: '10',
        total: '104.99',
        companyName: 'Empresa 01',
        description: 'Produto 01',
      },
      {
        id: 2,
        issueDate: '2025-04-10',
        quantity: '2',
        total: '500.0',
        companyName: 'Empresa 02',
        description: 'Produto 02',
      },
    ])
  })
})
