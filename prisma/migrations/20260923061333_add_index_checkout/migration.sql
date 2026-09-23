-- DropIndex
DROP INDEX "Address_userId_idx";

-- CreateIndex
CREATE INDEX "Address_userId_id_idx" ON "Address"("userId", "id");
