import { genSalt, hash } from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../../db/client'
import { createUser } from '../../../functions/users/create-user'
import { authenticate } from '../../../hook/auth-hook'

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '',
    {
      schema: {
        summary: 'Register a user',
        tags: ['Users'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          role: z.union([z.literal('administrador'), z.literal('vendedor')]),
          companyId: z.string().cuid2(),
        }),
        response: {
          201: z.object({
            userId: z.string().cuid2(),
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
        security: [{ CookieAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const { name, email, password, role, companyId } = request.body

      const userExists = await db.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.email, email)
        },
      })

      if (userExists) {
        return reply.code(400).send({ message: 'E-mail já cadastrado!' })
      }

      const companyExists = await db.query.companies.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, companyId)
        },
      })

      if (!companyExists) {
        return reply.code(404).send({ message: 'Empresa não encontrada!' })
      }

      const salt = await genSalt(10)
      const grindPassword = await hash(password, salt)

      const { userId } = await createUser({
        name,
        email,
        password: grindPassword,
        role,
        companyId,
      })

      return reply.status(201).send({ userId })
    }
  )
}
