ALTER TABLE "accounts_receivable" DROP CONSTRAINT "accounts_receivable_customer_group_id_customers_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts_receivable" DROP COLUMN "customer_group_id";