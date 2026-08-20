/*
  Warnings:

  - You are about to drop the column `esimatedDays` on the `ShippingMethodConfig` table. All the data in the column will be lost.
  - Added the required column `estimatedDays` to the `ShippingMethodConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShippingMethodConfig"
ADD COLUMN "estimatedDays" INTEGER NOT NULL DEFAULT 7;
