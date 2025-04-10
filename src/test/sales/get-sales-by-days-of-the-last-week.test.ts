jest.mock('../../functions/sales/get-sales-by-days-of-the-last-week', () => ({
  getSalesByDaysOfTheLastWeek: jest.fn(),
}))

import { getSalesByDaysOfTheLastWeek as mockedGetSalesByDaysOfTheLastWeek } from '../../functions/sales/get-sales-by-days-of-the-last-week'
import { buildApp } from '../../http/app'

describe('Get sales by days of the last week route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(mockedGetSalesByDaysOfTheLastWeek as jest.Mock).mockResolvedValueOnce({
      salesByDay: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/sales/last/week',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e o total de vendas por dia dos últimos 7 dias', async () => {
    const fakeSales = [
      {
        issueDate: '2025-03-25',
        dayOfWeek: 'Terça-feira',
        salesCount: 535,
      },
      {
        issueDate: '2025-03-24',
        dayOfWeek: 'Segunda-feira',
        salesCount: 1524,
      },
    ]
    ;(mockedGetSalesByDaysOfTheLastWeek as jest.Mock).mockResolvedValueOnce({
      salesByDay: fakeSales,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/sales/last/week',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('salesByDay')
    expect(payload.salesByDay).toEqual(fakeSales)
  })
})
