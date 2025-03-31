import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { productGroups } from '.'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),
  groupId: integer('group_id')
    .notNull()
    .references(() => productGroups.id),
})

export const productsRelations = relations(products, ({ one }) => {
  return {
    group: one(productGroups, {
      fields: [products.groupId],
      references: [productGroups.id],
      relationName: 'product_group',
    }),
  }
})
