import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { companies } from '.'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  idCompany: text('id_company')
    .notNull()
    .references(() => companies.id),
  tradeName: text('trade_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  position: text('position').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const usersRelations = relations(users, ({ one }) => {
  return {
    company: one(companies, {
      fields: [users.idCompany],
      references: [companies.id],
      relationName: 'user_company'
    })
  }
})