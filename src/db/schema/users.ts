import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { companies } from '.'

export const userRole = pgEnum('user_role', ['administrador', 'vendedor'])

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  companyId: text('id_company')
    .notNull()
    .references(() => companies.id),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: userRole('role').default('vendedor').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const usersRelations = relations(users, ({ one }) => {
  return {
    company: one(companies, {
      fields: [users.companyId],
      references: [companies.id],
      relationName: 'user_company',
    }),
  }
})
