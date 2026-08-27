-- Add reporterId column to moderationFlags
ALTER TABLE "moderationFlags" ADD COLUMN "reporterId" TEXT NOT NULL DEFAULT '';

-- Remove the temporary default now that the column exists
ALTER TABLE "moderationFlags" ALTER COLUMN "reporterId" DROP DEFAULT;

-- Add foreign key constraint to user table
ALTER TABLE "moderationFlags" ADD CONSTRAINT "moderationFlags_reporterId_fkey"
    FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add unique constraint to prevent duplicate reports per user per post
ALTER TABLE "moderationFlags" ADD CONSTRAINT "moderationFlags_postId_reporterId_uidx"
    UNIQUE ("postId", "reporterId");
