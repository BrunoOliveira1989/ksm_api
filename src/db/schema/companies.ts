import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from '.'

export const companies = pgTable('companies', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  cnpj: text('cnpj').unique().notNull(),
  companyName: text('company_name').notNull(),
  tradeName: text('trade_name').notNull(),
  cep: text('cep').notNull(),
  street: text('street').notNull(),
  number: integer('number').notNull(),
  complement: text('complement'),
  district: text('district').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const companiesRealtions = relations(companies, ({ many }) => {
  return {
    users: many(users),
  }
})
