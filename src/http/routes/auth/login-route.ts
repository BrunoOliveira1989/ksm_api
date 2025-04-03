import { compare } from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { login } from '../../../functions/auth/login'

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        summary: 'Login',
        operationId: 'login',
        tags: ['Authentication'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string().cuid2(),
              name: z.string(),
              email: z.string().email(),
              role: z.union([
                z.literal('administrador'),
                z.literal('vendedor'),
              ]),
              companyId: z.string().cuid2(),
              tradeName: z.string(),
            }),
            token: z.string().jwt(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { user: userData } = await login(email)

      if (!userData) {
        return reply.code(404).send({ message: 'Credenciais inválidas!' })
      }

      const isPasswordValid = await compare(password, userData.password)

      if (!isPasswordValid) {
        return reply.code(404).send({ message: 'Credenciais inválidas!' })
      }

      const token = app.jwt.sign({ userId: userData.id })

      const { password: __, company, ...user } = userData

      return reply.status(200).send({
        user: {
          ...user,
          tradeName: company.tradeName,
        },
        token,
      })
      // return reply
      //   .status(200)
      //   .setCookie('token', token, {
      //     httpOnly: true,
      //     sameSite: 'strict',
      //     path: '/',
      //     maxAge: 3600 * 8,
      //   })
      //   .send({
      //     user: {
      //       ...user,
      //       tradeName: company.tradeName,
      //     },
      //   })
    }
  )
}
