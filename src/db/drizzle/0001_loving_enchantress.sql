CREATE TYPE "public"."user_role" AS ENUM('administrador', 'vendedor');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "position" TO "role";