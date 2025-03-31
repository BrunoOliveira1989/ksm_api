import { date, decimal, integer, pgTable, text } from 'drizzle-orm/pg-core'

export const sales = pgTable('sales', {
  id: integer('id').primaryKey(),
  issueDate: date('issue_date'),
  type: integer('type'),
  type_description: text('type_description'),
  customer_id: integer('customer_id'),
  companyName: text('company_name'),
  tradeName: text('trade_name'),
  costumerGroupId: integer('customer_group_id'),
  customerGroupDescription: text('customer_group_description'),
  city: text('city'),
  state: text('state'),
  productId: text('product_id'),
  productDescription: text('product_description'),
  productGroupId: integer('product_group_id'),
  productGroupDescription: text('product_group_description'),
  quantity: decimal('quantity'),
  unitValue: decimal('unit_value'),
  total: decimal('total'),
})
