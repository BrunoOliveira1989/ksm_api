jest.mock('../../functions/products/get-all-products', () => ({
  getAllProducts: jest.fn(),
}))

import { getAllProducts as mockedGetAllProducts } from '../../functions/products/get-all-products'
import { buildApp } from '../../http/app'

describe('Get all products route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Verifica se o parâmetro de paginação (page) é passado corretamente', async () => {
    const fakeProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
        unitValue: 15,
      },
    ]
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: fakeProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    await app.inject({
      method: 'GET',
      url: '/products?page=2',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(mockedGetAllProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
      })
    )
  })

  it('Verifica se o parâmetro de filtragem (groupId) é passado corretamente', async () => {
    const fakeProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
        unitValue: 15,
      },
    ]
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: fakeProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    await app.inject({
      method: 'GET',
      url: '/products?groupId=2',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(mockedGetAllProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        groupId: 2,
      })
    )
  })

  it('Verifica se os parâmetros de filtragem (groupId) e paginação (page) são passados corretamente', async () => {
    const fakeProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
        unitValue: 15,
      },
    ]
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: fakeProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    await app.inject({
      method: 'GET',
      url: '/products?page=2&groupId=2',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(mockedGetAllProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        groupId: 2,
      })
    )
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 204 se nenhum dado for encontrado na página solicitada', async () => {
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products?page=10',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 204 se nenhum dado for encontrado no grupo de produtos solicitado', async () => {
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products?groupId=5',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 204 se nenhum dado for encontrado no grupo de produtos e na pagina solicitados', async () => {
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products?page=10&groupId=5',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e todos os produtos dá primeira página', async () => {
    const fakeProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
      },
      {
        id: 'Id-2',
        description: 'Produto 2',
      },
    ]
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: fakeProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('products')
    expect(payload.products).toEqual(fakeProducts)
  })

  it('Retorna 200 e todos os produtos da página solicitada', async () => {
    const fakeProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
      },
      {
        id: 'Id-2',
        description: 'Produto 2',
      },
    ]
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: fakeProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products?page=2',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('products')
    expect(payload.products).toEqual(fakeProducts)
  })

  it('Retorna 200 e todos os produtos do grupo de produtos solicitado', async () => {
    const fakeProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
      },
      {
        id: 'Id-2',
        description: 'Produto 2',
      },
    ]
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: fakeProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products?groupId=2',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('products')
    expect(payload.products).toEqual(fakeProducts)
  })

  it('Retorna 200 e todos os produtos do grupo de produtos e da página solicitados', async () => {
    const fakeProducts = [
      {
        id: 'Id-1',
        description: 'Produto 1',
      },
      {
        id: 'Id-2',
        description: 'Produto 2',
      },
    ]
    ;(mockedGetAllProducts as jest.Mock).mockResolvedValueOnce({
      products: fakeProducts,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products?groupId=2',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('products')
    expect(payload.products).toEqual(fakeProducts)
  })
})
