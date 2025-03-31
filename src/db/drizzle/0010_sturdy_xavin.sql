ALTER TABLE "customers" ALTER COLUMN "company_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "trade_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_group_id_products_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."products_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "group_description";