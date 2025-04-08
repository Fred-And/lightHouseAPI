/*
  Warnings:

  - The `printId` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "printId",
ADD COLUMN     "printId" INTEGER;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_printId_fkey" FOREIGN KEY ("printId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
