/*
  Warnings:

  - You are about to drop the column `attribute` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "attribute",
DROP COLUMN "salePrice",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "comparePrice" DECIMAL(10,2),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "storage" TEXT;
