ALTER TABLE "fiddle_files" ALTER COLUMN "fiddle_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fiddles" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fiddles" ALTER COLUMN "title" SET DATA TYPE text;