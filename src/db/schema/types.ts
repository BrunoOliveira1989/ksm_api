import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { sales } from '.'

export const types = pgTable('types', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
})

export const typesRelations = relations(types, ({ many }) => {
  return {
    sales: many(sales),
  }
})
