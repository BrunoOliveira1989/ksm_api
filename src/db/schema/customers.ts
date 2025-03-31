import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { customersGroups } from '.'

export const customers = pgTable('customers', {
  id: integer('id').primaryKey(),
  companyName: text('company_name'),
  tradeName: text('trade_name'),
  city: text('city'),
  state: text('state'),
  groupId: integer('group_id').references(() => customersGroups.id),
})

export const customersRelations = relations(customers, ({ one }) => {
  return {
    group: one(customersGroups, {
      fields: [customers.groupId],
      references: [customersGroups.id],
      relationName: 'customer_group',
    }),
  }
})
