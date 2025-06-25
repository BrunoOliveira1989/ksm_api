jest.mock('../../functions/customers/get-all-customers', () => ({
  getCustomerById: jest.fn(),
}))

import { getCustomerById as mockedGetCustomerById } from '../../functions/customers/get-customer-by-id'
import { buildApp } from '../../http/app'

describe('Get customer by id', () => {
  let app: ReturnType<typeof buildApp>
  const fakeCustomer = {
    companyName: 'Empresa',
    tradeName: 'Empresa Ltda.',
    group: 'Grupo',
    city: 'Cidade',
    state: 'SP',
  }
  const fakeLastSales = [
    {
      productId: 1,
      productDescription: 'Produto 1',
      quantity: 1,
      total: 1000,
      date: new Date(),
    },
    {
      productId: 2,
      productDescription: 'Produto 2',
      quantity: 2,
      total: 2000,
      date: new Date(),
    },
  ]
  const fakeTotalPurchasePerMonth = [
    {
      year: '2025',
      month: '01',
      totalQuantity: 1,
      totalPuchases: 1,
    },
    {
      year: '2025',
      month: '02',
      totalQuantity: 2,
      totalPuchases: 2,
    },
  ]

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Verifica se o parâmetro id é passado corretamente', async () => {
    ;(mockedGetCustomerById as jest.Mock).mockResolvedValueOnce({
      customer: fakeCustomer,
      lastSales: fakeLastSales,
      totalPurchasePerMonth: fakeTotalPurchasePerMonth,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    await app.inject({
      method: 'GET',
      url: '/customers/pkykshfl40260a09frb8v2fd6',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(mockedGetCustomerById).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'pkykshfl40260a09frb8v2fd6',
      })
    )
  })

  it('Retorna 404 se dados não encontrados', async () => {
    ;(mockedGetCustomerById as jest.Mock).mockResolvedValueOnce({
      customer: undefined,
      lastSales: [],
      totalPurchasePerMonth: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers/pkykshfl40260a09frb8v2fd6',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(404)
    const { message } = response.json()
    expect(message).toEqual('Cliente não encontrado!')
  })

  it('Retorna 200 e dados do cliente', async () => {
    ;(mockedGetCustomerById as jest.Mock).mockResolvedValueOnce({
      customer: fakeCustomer,
      lastSales: fakeLastSales,
      totalPurchasePerMonth: fakeTotalPurchasePerMonth,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/customers/pkykshfl40260a09frb8v2fd6',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(200)
    const payload = response.json()
    expect(payload).toHaveProperty('customer')
    expect(payload.customer).toEqual(fakeCustomer)
    expect(payload).toHaveProperty('lastSales')
    expect(payload.lastSales).toEqual(fakeLastSales)
    expect(payload).toHaveProperty('totalPurchasePerMonth')
    expect(payload.totalPurchasePerMonth).toEqual(fakeTotalPurchasePerMonth)
  })
})
