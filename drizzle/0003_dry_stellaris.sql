ALTER TABLE "fiddle_files" DROP CONSTRAINT IF EXISTS "fiddle_files_fiddle_id_fiddles_id_fk";--> statement-breakpoint

ALTER TABLE "fiddle_files" ALTER COLUMN "fiddle_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fiddles" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "fiddle_files" ADD CONSTRAINT "fiddle_files_fiddle_id_fiddles_id_fk" FOREIGN KEY ("fiddle_id") REFERENCES "fiddles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
