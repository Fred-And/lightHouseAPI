-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "laborCost" DECIMAL(65,30),
ADD COLUMN     "marginPercentage" INTEGER,
ADD COLUMN     "packagingCost" DECIMAL(65,30),
ADD COLUMN     "printCost" DECIMAL(65,30),
ADD COLUMN     "shippingCost" DECIMAL(65,30);
