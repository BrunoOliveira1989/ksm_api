jest.mock('../../functions/customers/get-top-buyers-product', () => ({
  getTopBuyersProduct: jest.fn(),
}))

import { getTopBuyersProduct as mockedGetTopBuyersProduct } from '../../functions/customers/get-top-buyers-product'
import { buildApp } from '../../http/app'

describe('Get top buyers product route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetTopBuyersProduct as jest.Mock).mockResolvedValueOnce({
      topBuyers: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers/top/1',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e o top 10 compradores do produto', async () => {
    const fakeBuyers = [
      {
        customerId: 1,
        totalProductsPurchased: 15,
        totalPurchases: 35,
        totalValue: 575.5,
        companyName: 'Empresa 01',
      },
      {
        customerId: 2,
        totalProductsPurchased: 36,
        totalPurchases: 115,
        totalValue: 4350.0,
        companyName: 'Empresa 02',
      },
    ]
    ;(mockedGetTopBuyersProduct as jest.Mock).mockResolvedValueOnce({
      topBuyers: fakeBuyers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/customers/top/1',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('topBuyers')
    expect(payload.topBuyers).toEqual(fakeBuyers)
  })
})
