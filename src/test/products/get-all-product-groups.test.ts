jest.mock('../../functions/products/get-all-product-groups', () => ({
  getAllProductGroups: jest.fn(),
}))

import { getAllProductGroups as mockedGetAllProductGroups } from '../../functions/products/get-all-product-groups'
import { buildApp } from '../../http/app'

describe('Get all product groups route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetAllProductGroups as jest.Mock).mockResolvedValueOnce({
      groups: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products/groups',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e todos os grupos de clientes', async () => {
    const fakeGroups = [
      {
        id: 1,
        description: 'Grupo 1',
      },
      {
        id: 2,
        description: 'Grupo 2',
      },
    ]
    ;(mockedGetAllProductGroups as jest.Mock).mockResolvedValueOnce({
      groups: fakeGroups,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products/groups',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('groups')
    expect(payload.groups).toEqual(fakeGroups)
  })
})
