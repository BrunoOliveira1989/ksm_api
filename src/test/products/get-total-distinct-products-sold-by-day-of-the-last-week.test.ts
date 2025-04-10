jest.mock(
  '../../functions/products/get-total-distinct-products-sold-by-day-of-the-last-week',
  () => ({
    getTotalDistinctProductsSoldByDayOfTheLastWeek: jest.fn(),
  })
)

import { getTotalDistinctProductsSoldByDayOfTheLastWeek as mockedGetTotalDistinctProductsSoldByDayOfTheLastWeek } from '../../functions/products/get-total-distinct-products-sold-by-day-of-the-last-week'
import { buildApp } from '../../http/app'

describe('Get total distinct products sold by day of the last week route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 204 se nenhum dado for encontrado', async () => {
    ;(
      mockedGetTotalDistinctProductsSoldByDayOfTheLastWeek as jest.Mock
    ).mockResolvedValueOnce({
      salesByDay: [],
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/products/count/last/week',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e os dados do produto solicitado', async () => {
    const fakeSales = [
      {
        issueDate: '2025-03-04',
        dayOfWeek: 'Terça-feira',
        productsCount: 854,
        productsDistinctCount: 245,
      },
      {
        issueDate: '2025-03-03',
        dayOfWeek: 'Segunda-feira',
        productsCount: 573,
        productsDistinctCount: 106,
      },
    ]
    ;(
      mockedGetTotalDistinctProductsSoldByDayOfTheLastWeek as jest.Mock
    ).mockResolvedValueOnce({
      salesByDay: fakeSales,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/products/count/last/week',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('salesByDay')
    expect(payload.salesByDay).toEqual(fakeSales)
  })
})
