jest.mock('../../functions/customers/get-all-customers', () => ({
  getAllCustomers: jest.fn(),
}))

import { getAllCustomers as mockedGetAllCustomers } from '../../functions/customers/get-all-customers'
import { buildApp } from '../../http/app'

describe('Get all customers route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Verifica se o parâmetro de paginação (page) é passado corretamente', async () => {
    const fakeCustomers = [
      {
        id: 1,
        companyName: 'Empresa 1',
      },
    ]
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: fakeCustomers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    await app.inject({
      method: 'GET',
      url: '/customers?page=2',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(mockedGetAllCustomers).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
      })
    )
  })

  it('Verifica se o parâmetro de filtragem (groupId) é passado corretamente', async () => {
    const fakeCustomers = [
      {
        id: 1,
        companyName: 'Empresa 1',
      },
    ]
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: fakeCustomers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    await app.inject({
      method: 'GET',
      url: '/customers?groupId=2',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(mockedGetAllCustomers).toHaveBeenCalledWith(
      expect.objectContaining({
        groupId: 2,
      })
    )
  })

  it('Verifica se os parâmetros de filtragem (groupId) e paginação (page) são passados corretamente', async () => {
    const fakeCustomers = [
      {
        id: 1,
        companyName: 'Empresa 1',
      },
    ]
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: fakeCustomers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    await app.inject({
      method: 'GET',
      url: '/customers?page=2&groupId=2',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(mockedGetAllCustomers).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        groupId: 2,
      })
    )
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 204 se nenhum dado for encontrado na página solicitada', async () => {
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers?page=10',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 204 se nenhum dado for encontrado no grupo de clientes solicitado', async () => {
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers?groupId=5',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 204 se nenhum dado for encontrado no grupo de clientes e na pagina solicitados', async () => {
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers?page=10&groupId=5',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e todos os clientes dá primeira página', async () => {
    const fakeCustomers = [
      {
        id: 1,
        companyName: 'Empresa 1',
      },
      {
        id: 2,
        companyName: 'Empresa 2',
      },
    ]
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: fakeCustomers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/customers',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('customers')
    expect(payload.customers).toEqual(fakeCustomers)
  })

  it('Retorna 200 e todos os clientes da página solicitada', async () => {
    const fakeCustomers = [
      {
        id: 1,
        companyName: 'Empresa 1',
      },
      {
        id: 2,
        companyName: 'Empresa 2',
      },
    ]
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: fakeCustomers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/customers?page=2',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('customers')
    expect(payload.customers).toEqual(fakeCustomers)
  })

  it('Retorna 200 e todos os clientes do grupo de clientes solicitado', async () => {
    const fakeCustomers = [
      {
        id: 1,
        companyName: 'Empresa 1',
      },
      {
        id: 2,
        companyName: 'Empresa 2',
      },
    ]
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: fakeCustomers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/customers?groupId=2',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('customers')
    expect(payload.customers).toEqual(fakeCustomers)
  })

  it('Retorna 200 e todos os clientes do grupo de clientes e da página solicitados', async () => {
    const fakeCustomers = [
      {
        id: 1,
        companyName: 'Empresa 1',
      },
      {
        id: 2,
        companyName: 'Empresa 2',
      },
    ]
    ;(mockedGetAllCustomers as jest.Mock).mockResolvedValueOnce({
      customers: fakeCustomers,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/customers?groupId=2',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('customers')
    expect(payload.customers).toEqual(fakeCustomers)
  })
})
