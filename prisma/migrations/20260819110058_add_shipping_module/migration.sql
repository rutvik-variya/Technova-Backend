-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('STANDARD', 'EXPRESS');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingMethod" "ShippingMethod",
ADD COLUMN     "shippingStatus" "ShippingStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "ShippingMethodConfig" (
    "id" TEXT NOT NULL,
    "method" "ShippingMethod" NOT NULL,
    "name" TEXT NOT NULL,
    "baseCharge" DECIMAL(10,2) NOT NULL,
    "freeShippingAbove" DECIMAL(10,2) NOT NULL,
    "esimatedDays" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingMethodConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingMethodConfig_method_key" ON "ShippingMethodConfig"("method");

-- CreateIndex
CREATE INDEX "ShippingMethodConfig_isActive_idx" ON "ShippingMethodConfig"("isActive");
