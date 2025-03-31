import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { accountsReceivable, customerGroups } from '.'

export const customers = pgTable('customers', {
  id: integer('id').primaryKey(),
  companyName: text('company_name').notNull(),
  tradeName: text('trade_name').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  groupId: integer('group_id')
    .notNull()
    .references(() => customerGroups.id),
})

export const customersRelations = relations(customers, ({ one, many }) => {
  return {
    group: one(customerGroups, {
      fields: [customers.groupId],
      references: [customerGroups.id],
      relationName: 'customer_group',
    }),
    accounts: many(accountsReceivable),
  }
})
