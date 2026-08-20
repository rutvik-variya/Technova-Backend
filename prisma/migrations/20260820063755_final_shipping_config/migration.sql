/*
  Warnings:

  - You are about to drop the column `esimatedDays` on the `ShippingMethodConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShippingMethodConfig" DROP COLUMN "esimatedDays",
ALTER COLUMN "estimatedDays" DROP DEFAULT;
