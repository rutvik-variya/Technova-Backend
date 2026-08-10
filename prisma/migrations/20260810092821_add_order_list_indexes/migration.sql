-- DropIndex
DROP INDEX "Order_status_idx";

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "Order_userId_paymentStatus_idx" ON "Order"("userId", "paymentStatus");
