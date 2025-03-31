import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  description: text('description'),
  groupId: integer('group_id'),
  groupDescription: text('group_description'),
})
