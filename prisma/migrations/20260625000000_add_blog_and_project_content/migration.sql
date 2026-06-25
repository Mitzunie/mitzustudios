-- Add content column (nullable) and slug column (nullable initially) to Project
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "content" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "slug" TEXT;

-- Backfill slug for existing projects
UPDATE "Project" SET "slug" = lower(regexp_replace(regexp_replace("title", '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6) WHERE "slug" IS NULL;

-- Make slug NOT NULL and add unique constraint
ALTER TABLE "Project" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Project_slug_key" ON "Project"("slug");
CREATE INDEX IF NOT EXISTS "Project_slug_idx" ON "Project"("slug");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Post_slug_idx" ON "Post"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Post_published_idx" ON "Post"("published");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Post_authorId_idx" ON "Post"("authorId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Post_authorId_fkey'
    ) THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
