import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const productsGroups = pgTable('products_groups', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
})
