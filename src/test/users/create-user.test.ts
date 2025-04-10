jest.mock('../../functions/users/create-user', () => ({
  createUser: jest.fn(),
}))

jest.mock('../../functions/users/check-user-exists', () => ({
  checkUserExists: jest.fn(),
}))

jest.mock('../../functions/companies/check-company-exists-by-id.ts', () => ({
  checkCompanyExistsById: jest.fn(),
}))

import { checkCompanyExistsById as mockedCheckUserExistsById } from '../../functions/companies/check-company-exists-by-id'
import { checkUserExists as mockedCheckUserExists } from '../../functions/users/check-user-exists'
import { createUser as mockedCreateUser } from '../../functions/users/create-user'
import { buildApp } from '../../http/app'

describe('Create user route', () => {
  let app: ReturnType<typeof buildApp>

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Retorna 400 se o e-mail já está cadastrado', async () => {
    ;(mockedCheckUserExists as jest.Mock).mockResolvedValueOnce(true)

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'senha',
        role: 'administrador' as const,
        companyId: '01h5bx9p1v3j8tn80p0x9kr8i',
      },
    })

    expect(response.statusCode).toBe(400)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('message')
    expect(payload.message).toEqual('E-mail já cadastrado!')
  })

  it('Retorna 404 se a empresa não for encontrada', async () => {
    ;(mockedCheckUserExists as jest.Mock).mockResolvedValueOnce(false)
    ;(mockedCheckUserExistsById as jest.Mock).mockResolvedValueOnce(false)

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'senha',
        role: 'administrador' as const,
        companyId: '01h5bx9p1v3j8tn80p0x9kr8i',
      },
    })

    expect(response.statusCode).toBe(404)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('message')
    expect(payload.message).toEqual('Empresa não encontrada!')
  })

  it('Retorna 201 e o id do usuário cadastrado em caso de sucesso no cadastro', async () => {
    const fakeUserId = 'ckylshfl40000a09frb8v2pd6'
    ;(mockedCheckUserExists as jest.Mock).mockResolvedValueOnce(false)
    ;(mockedCheckUserExistsById as jest.Mock).mockResolvedValueOnce(true)
    ;(mockedCreateUser as jest.Mock).mockResolvedValueOnce({
      userId: fakeUserId,
    })

    const token = app.jwt.sign({ userId: 'ckylshfl40000a09frb8v2pd6' })

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'senha',
        role: 'administrador' as const,
        companyId: '01h5bx9p1v3j8tn80p0x9kr8i',
      },
    })

    expect(response.statusCode).toBe(201)
    const payload = JSON.parse(response.payload)
    expect(payload).toHaveProperty('userId')
    expect(payload.userId).toEqual(fakeUserId)
  })
})
