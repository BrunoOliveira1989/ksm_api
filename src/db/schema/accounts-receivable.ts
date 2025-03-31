import { relations } from 'drizzle-orm'
import { date, decimal, integer, pgTable, text } from 'drizzle-orm/pg-core'
import { customers } from '.'

export const accountsReceivable = pgTable('accounts_receivable', {
  id: integer('id').primaryKey(),
  document: text('document').notNull(),
  title: integer('title').notNull(),
  installments: integer('installments').notNull(),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),
  titleValue: decimal('title_value').notNull(),
  receivedValue: decimal('received_value').notNull(),
  balanceValue: decimal('balance_value').notNull(),
  issueDate: date('issue_date').notNull(),
  entryDate: date('entry_date').notNull(),
  dueDate: date('due_date').notNull(),
})

export const accountsReceivableRelations = relations(
  accountsReceivable,
  ({ one }) => {
    return {
      customer: one(customers, {
        fields: [accountsReceivable.customerId],
        references: [customers.id],
        relationName: 'customer_accounts',
      }),
    }
  }
)
