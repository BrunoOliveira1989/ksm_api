import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { checkCompanyExists } from '../../../functions/companies/check-company-exists'
import { createCompany } from '../../../functions/companies/create-company'
import { authenticate } from '../../../hook/auth-hook'

export const createCompanyRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '',
    {
      schema: {
        summary: 'Register a company',
        operationId: 'createCompany',
        tags: ['Companies'],
        body: z.object({
          cnpj: z.string(),
          companyName: z.string(),
          tradeName: z.string(),
          cep: z.string(),
          street: z.string(),
          number: z.coerce.number(),
          complement: z.string().optional(),
          district: z.string(),
          city: z.string(),
          state: z.string(),
        }),
        response: {
          201: z.object({
            companyId: z.string().cuid2(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const {
        cnpj,
        companyName,
        tradeName,
        cep,
        street,
        number,
        complement,
        district,
        city,
        state,
      } = request.body

      const companyExists = await checkCompanyExists(cnpj)

      if (companyExists) {
        return reply.code(400).send({ message: 'Empresa já cadastrada!' })
      }

      const { companyId } = await createCompany({
        cnpj: cnpj.replace(/[^\d]/g, ''),
        companyName,
        tradeName,
        cep: cep.replace(/[^\d]/g, ''),
        street,
        number,
        complement,
        district,
        city,
        state,
      })

      return reply.status(201).send({ companyId })
    }
  )
}
