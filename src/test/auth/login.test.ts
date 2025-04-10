jest.mock('../../functions/auth/login', () => ({
  login: jest.fn(),
}))

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}))

import { compare as mockedCompare } from 'bcrypt'
import { login as mockedLogin } from '../../functions/auth/login'
import { buildApp } from '../../http/app'

describe('Login route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 404 se o usuário não encontrado', async () => {
    ;(mockedLogin as jest.Mock).mockResolvedValueOnce({ user: null })

    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'inexistente@example.com', password: 'qualquer' },
    })

    expect(response.statusCode).toBe(404)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('message')
    expect(payload.message).toEqual('Credenciais inválidas!')
  })

  it('Retorna 404 se a senha estiver incorreta', async () => {
    const fakeUser = {
      id: 'ckylshfl40000a09frb8v2pd6',
      name: 'Fulano',
      email: 'fulano@email.com',
      password: 'hash',
      role: 'vendedor' as const,
      companyId: '01h5bx9p1v3j8tn80p0x9kr8i',
      company: { tradeName: 'Empresa' },
    }
    ;(mockedLogin as jest.Mock).mockResolvedValueOnce({ user: fakeUser })
    ;(mockedCompare as jest.Mock).mockResolvedValueOnce(false)

    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'fulano@email.com', password: 'senha_errada' },
    })

    expect(response.statusCode).toBe(404)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('message')
    expect(payload.message).toEqual('Credenciais inválidas!')
  })

  it('Retorna 200 os dados do usuário e um token de acesso em caso de sucesso no login', async () => {
    const fakeUser = {
      id: 'ckylshfl40000a09frb8v2pd6',
      name: 'Fulano',
      email: 'fulano@email.com',
      password: 'hash',
      role: 'administrador' as const,
      companyId: '01h5bx9p1v3j8tn80p0x9kr8i',
      company: { tradeName: 'Empresa' },
    }
    ;(mockedLogin as jest.Mock).mockResolvedValueOnce({ user: fakeUser })
    ;(mockedCompare as jest.Mock).mockResolvedValueOnce(true)

    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'fulano@email.com', password: 'senha_correta' },
    })

    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('user')
    expect(payload.user).toEqual({
      id: 'ckylshfl40000a09frb8v2pd6',
      name: 'Fulano',
      email: 'fulano@email.com',
      role: 'administrador',
      companyId: '01h5bx9p1v3j8tn80p0x9kr8i',
      tradeName: 'Empresa',
    })
    expect(payload).toHaveProperty('token')
  })
})
