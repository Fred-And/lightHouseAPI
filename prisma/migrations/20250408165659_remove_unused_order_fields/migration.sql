/*
  Warnings:

  - You are about to drop the column `finalCustomerPriceUnity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productUnityCost` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "finalCustomerPriceUnity",
DROP COLUMN "notes",
DROP COLUMN "productUnityCost";
