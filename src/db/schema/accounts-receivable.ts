import { date, decimal, integer, pgTable, text } from 'drizzle-orm/pg-core'

export const accountsReceivable = pgTable('accounts_receivable', {
  id: integer('id').primaryKey(),
  document: text('document'),
  title: integer('title'),
  installments: integer('installments'),
  customerId: integer('customer_id'),
  companyName: text('company_name'),
  tradeName: text('trade_name'),
  customerGroupId: integer('customer_group_id'),
  customerGroupDescription: text('customer_group_description'),
  city: text('city'),
  state: text('state'),
  titleValue: decimal('title_value'),
  receivedValue: decimal('received_value'),
  balanceValue: decimal('balance_value'),
  issueDate: date('issue_date'),
  entryDate: date('entry_date'),
  dueDate: date('due_date'),
})
