import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const customersGroups = pgTable('customers_groups', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
})
