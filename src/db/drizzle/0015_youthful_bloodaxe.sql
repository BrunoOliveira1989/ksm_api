ALTER TABLE "customers_groups" RENAME TO "customer_groups";--> statement-breakpoint
ALTER TABLE "customers" DROP CONSTRAINT "customers_group_id_customers_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_group_id_customer_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."customer_groups"("id") ON DELETE no action ON UPDATE no action;