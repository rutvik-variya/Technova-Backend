-- DropIndex
DROP INDEX "ProductImage_productId_idx";

-- CreateIndex
CREATE INDEX "ProductImage_productId_isPrimary_idx" ON "ProductImage"("productId", "isPrimary");
