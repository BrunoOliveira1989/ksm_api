import { relations } from 'drizzle-orm'
import { date, decimal, integer, pgTable, text } from 'drizzle-orm/pg-core'
import { customers, products, types } from '.'

export const sales = pgTable('sales', {
  id: integer('id').primaryKey(),
  issueDate: date('issue_date').notNull(),
  typeId: integer('type_id')
    .notNull()
    .references(() => types.id),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),
  productId: text('product_id')
    .notNull()
    .references(() => products.id),
  quantity: decimal('quantity').notNull(),
  unitValue: decimal('unit_value').notNull(),
  total: decimal('total').notNull(),
})

export const salesRelations = relations(sales, ({ one }) => {
  return {
    customer: one(customers, {
      fields: [sales.customerId],
      references: [customers.id],
      relationName: 'customer_sale',
    }),
    product: one(products, {
      fields: [sales.productId],
      references: [products.id],
      relationName: 'product_sale',
    }),
    type: one(types, {
      fields: [sales.typeId],
      references: [types.id],
      relationName: 'product_sale',
    }),
  }
})
