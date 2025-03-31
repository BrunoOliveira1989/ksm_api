ALTER TABLE "accounts_receivable" ALTER COLUMN "document" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "installments" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "customer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "customer_group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "title_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "received_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "balance_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "issue_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "entry_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ALTER COLUMN "due_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ADD CONSTRAINT "accounts_receivable_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ADD CONSTRAINT "accounts_receivable_customer_group_id_customers_groups_id_fk" FOREIGN KEY ("customer_group_id") REFERENCES "public"."customers_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts_receivable" DROP COLUMN "company_name";--> statement-breakpoint
ALTER TABLE "accounts_receivable" DROP COLUMN "trade_name";--> statement-breakpoint
ALTER TABLE "accounts_receivable" DROP COLUMN "customer_group_description";--> statement-breakpoint
ALTER TABLE "accounts_receivable" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "accounts_receivable" DROP COLUMN "state";