ALTER TABLE "products_groups" RENAME TO "product_groups";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_group_id_products_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_group_id_product_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."product_groups"("id") ON DELETE no action ON UPDATE no action;