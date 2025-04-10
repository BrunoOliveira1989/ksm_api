jest.mock('../../functions/sales/get-sales-by-product-group', () => ({
  getSalesByProductGroup: jest.fn(),
}))

import { getSalesByProductGroup as mockedGetSalesByProductGroup } from '../../functions/sales/get-sales-by-product-group'
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
    ;(mockedGetSalesByProductGroup as jest.Mock).mockResolvedValueOnce({
      salesByDay: null,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/sales/group',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })

  it('Retorna 200 e o total de vendas por grupos de produtos', async () => {
    const fakeSales = {
      total: 401865,
      groupedSales: [
        {
          groupId: 1,
          groupDescription: 'Grupo 1',
          totalGroupSales: 201465,
          totalValueGroupSales: 1564230,
        },
        {
          groupId: 2,
          groupDescription: 'Grupo 2',
          totalGroupSales: 200400,
          totalValueGroupSales: 1135450,
        },
      ],
    }
    ;(mockedGetSalesByProductGroup as jest.Mock).mockResolvedValueOnce({
      sales: fakeSales,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: '/sales/group',
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('sales')
    expect(payload.sales).toEqual(fakeSales)
  })
})
