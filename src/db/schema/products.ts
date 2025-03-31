import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { productsGroups } from '.'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),
  groupId: integer('group_id')
    .notNull()
    .references(() => productsGroups.id),
})

export const productsRelations = relations(products, ({ one }) => {
  return {
    group: one(productsGroups, {
      fields: [products.groupId],
      references: [productsGroups.id],
      relationName: 'product_group',
    }),
  }
})
