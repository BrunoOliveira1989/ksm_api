jest.mock('../../functions/products/get-product-by-id', () => ({
  getProductById: jest.fn(),
}))

import { getProductById as mockedGetProductById } from '../../functions/products/get-product-by-id'
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

  it('Retorna 404 se nenhum dado for encontrado', async () => {
    ;(mockedGetProductById as jest.Mock).mockResolvedValueOnce({
      product: null,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products/Id-1',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(404)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('message')
    expect(payload.message).toBe('Produto não encontrado')
  })

  it('Retorna 200 e os dados do produto solicitado', async () => {
    const fakeProduct = {
      id: 'Id-1',
      description: 'Produto',
      groupId: 1,
    }
    ;(mockedGetProductById as jest.Mock).mockResolvedValueOnce({
      product: fakeProduct,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products/Id-1',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('product')
    expect(payload.product).toEqual(fakeProduct)
  })
})
