import { buildApp } from '../../http/app'

describe('Check authenticate route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 401 se usuário não autenticado', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/auth/check',
    })

    expect(response.statusCode).toBe(401)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('message')
    expect(payload.message).toEqual('Usuário não autenticado')
  })

  it('Retorna 204 se o usuário estiver autenticado', async () => {
    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'GET',
      url: '/auth/check',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(response.payload).toBe('')
  })
})
