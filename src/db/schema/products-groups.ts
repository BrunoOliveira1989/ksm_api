import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { products } from '.'

export const productsGroups = pgTable('products_groups', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
})

export const productsGroupsRelations = relations(productsGroups, ({ many }) => {
  return {
    products: many(products),
  }
})
