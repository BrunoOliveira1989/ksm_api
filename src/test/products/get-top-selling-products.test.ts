jest.mock('../../functions/products/get-top-selling-products', () => ({
  getTopSellingProducts: jest.fn(),
}))

import { getTopSellingProducts as mockedGetTopSellingProducts } from '../../functions/products/get-top-selling-products'
import { buildApp } from '../../http/app'

describe('Get product by id route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetTopSellingProducts as jest.Mock).mockResolvedValueOnce({
      topProducts: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products/top/selling',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e os dados do produto solicitado', async () => {
    const fakeTopProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
        totalSelling: 15,
        totalSalesValue: 150,
      },
      {
        id: 'Id-2',
        description: 'Produto 2',
        totalSelling: 3,
        totalSalesValue: 45,
      },
    ]
    ;(mockedGetTopSellingProducts as jest.Mock).mockResolvedValueOnce({
      topProducts: fakeTopProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products/top/selling',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('topProducts')
    expect(payload.topProducts).toEqual(fakeTopProducts)
  })
})
