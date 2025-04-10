jest.mock('../../functions/customers/get-all-customer-groups', () => ({
  getAllCustomerGroups: jest.fn(),
}))

import { getAllCustomerGroups as mockedGetAllCustomerGroups } from '../../functions/customers/get-all-customer-groups'
import { buildApp } from '../../http/app'

describe('Get all customer groups route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetAllCustomerGroups as jest.Mock).mockResolvedValueOnce({
      groups: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers/groups',
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
    ;(mockedGetAllCustomerGroups as jest.Mock).mockResolvedValueOnce({
      groups: fakeGroups,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/customers/groups',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('groups')
    expect(payload.groups).toEqual(fakeGroups)
  })
})
