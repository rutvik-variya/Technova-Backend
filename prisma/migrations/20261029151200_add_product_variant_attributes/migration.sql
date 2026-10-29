ALTER TABLE "ProductVariant"
ADD COLUMN "attributes" JSONB NOT NULL DEFAULT '{}'::jsonb;
