CREATE TABLE "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"cnpj" text NOT NULL,
	"company_name" text NOT NULL,
	"trade_name" text NOT NULL,
	"cep" text NOT NULL,
	"street" text NOT NULL,
	"number" integer NOT NULL,
	"complement" text,
	"district" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "companies_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"id_company" text NOT NULL,
	"trade_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"position" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_company_companies_id_fk" FOREIGN KEY ("id_company") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;