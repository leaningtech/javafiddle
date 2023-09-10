CREATE TABLE IF NOT EXISTS "fiddle_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"fiddle_id" integer,
	"path" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fiddles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"created" timestamp DEFAULT now() NOT NULL,
	"updated" timestamp DEFAULT now() NOT NULL,
	"title" integer NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"joined" timestamp DEFAULT now() NOT NULL,
	"github_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fiddle_files" ADD CONSTRAINT "fiddle_files_fiddle_id_fiddles_id_fk" FOREIGN KEY ("fiddle_id") REFERENCES "fiddles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fiddles" ADD CONSTRAINT "fiddles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
