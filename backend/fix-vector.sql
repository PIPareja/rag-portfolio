ALTER TABLE "DocumentChunk" DROP COLUMN IF EXISTS embedding;
ALTER TABLE "DocumentChunk" ADD COLUMN embedding vector(3072);