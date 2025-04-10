jest.mock('../../functions/sales/get-product-sales-history', () => ({
  getProductSalesHistory: jest.fn(),
}))

import { getProductSalesHistory as mockedGetProductSalesHistory } from '../../functions/sales/get-product-sales-history'
import { buildApp } from '../../http/app'

describe('Get product sales history route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetProductSalesHistory as jest.Mock).mockResolvedValueOnce({
      history: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/sales/products/history/1',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e as 10 última vendas', async () => {
    const fakeHistory = [
      {
        year: 2025,
        month: 3,
        countSales: 5000.0,
        totalUnitSales: 500,
      },
      {
        year: 2025,
        month: 2,
        countSales: 400.0,
        totalUnitSales: 40,
      },
    ]
    ;(mockedGetProductSalesHistory as jest.Mock).mockResolvedValueOnce({
      history: fakeHistory,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/sales/products/history/1',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('history')
    expect(payload.history).toEqual(fakeHistory)
  })
})
