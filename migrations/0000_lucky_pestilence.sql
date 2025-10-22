CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(256),
	"email" varchar(256),
	"phone" varchar(32),
	"rego" varchar(32),
	"pickup_address" varchar(512),
	"notes" text,
	"status" varchar(64),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
