import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: integer('id').primaryKey(),
  companyName: text('company_name'),
  tradeName: text('trade_name'),
  city: text('city'),
  state: text('state'),
  groupId: integer('group_id'),
  groupDescription: text('group_description'),
})
