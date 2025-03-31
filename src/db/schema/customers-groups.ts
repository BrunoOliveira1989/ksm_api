import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { customers } from '.'

export const customersGroups = pgTable('customers_groups', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
})

export const customersGroupsRelations = relations(
  customersGroups,
  ({ many }) => {
    return {
      customers: many(customers),
    }
  }
)
