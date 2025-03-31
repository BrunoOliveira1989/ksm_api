import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { products } from '.'

export const productGroups = pgTable('product_groups', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
})

export const productGroupsRelations = relations(productGroups, ({ many }) => {
  return {
    products: many(products),
  }
})
