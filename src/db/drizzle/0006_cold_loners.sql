CREATE TABLE "accounts_receivable" (
	"id" integer PRIMARY KEY NOT NULL,
	"document" text,
	"title" integer,
	"installments" integer,
	"customer_id" integer,
	"company_name" text,
	"trade_name" text,
	"customer_group_id" integer,
	"customer_group_description" text,
	"city" text,
	"state" text,
	"title_value" numeric,
	"received_value" numeric,
	"balance_value" numeric,
	"issue_date" date,
	"entry_date" date,
	"due_date" date
);
