CREATE TABLE "types" (
	"id" integer PRIMARY KEY NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales" RENAME COLUMN "type" TO "type_id";--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "issue_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "customer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "unit_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "total" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "type_description";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "company_name";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "trade_name";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "customer_group_id";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "customer_group_description";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "product_description";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "product_group_id";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "product_group_description";