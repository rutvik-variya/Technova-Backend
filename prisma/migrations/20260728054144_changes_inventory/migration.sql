/*
  Warnings:

  - You are about to drop the column `lowStockThreshold` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `reservedStock` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "lowStockThreshold",
DROP COLUMN "reservedStock",
DROP COLUMN "stock",
ADD COLUMN     "lowStock" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reserved" INTEGER NOT NULL DEFAULT 0;
