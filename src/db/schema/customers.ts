import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { customersGroups } from '.'

export const customers = pgTable('customers', {
  id: integer('id').primaryKey(),
  companyName: text('company_name').notNull(),
  tradeName: text('trade_name').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  groupId: integer('group_id')
    .notNull()
    .references(() => customersGroups.id),
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
