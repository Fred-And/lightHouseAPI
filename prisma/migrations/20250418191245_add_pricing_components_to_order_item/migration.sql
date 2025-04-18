-- First, add the columns as nullable
ALTER TABLE "OrderItem"
ADD COLUMN "baseCost" DECIMAL(65,30),
ADD COLUMN "laborCost" DECIMAL(65,30),
ADD COLUMN "marginPercentage" INTEGER,
ADD COLUMN "packagingCost" DECIMAL(65,30),
ADD COLUMN "printCost" DECIMAL(65,30),
ADD COLUMN "shippingCost" DECIMAL(65,30);

-- Update existing records to set baseCost equal to unitPrice
-- This assumes that for existing orders, the unitPrice represents the base cost
UPDATE "OrderItem" SET
  "baseCost" = "unitPrice",
  "marginPercentage" = 30
WHERE "baseCost" IS NULL;

-- Now make baseCost NOT NULL
ALTER TABLE "OrderItem"
ALTER COLUMN "baseCost" SET NOT NULL;
