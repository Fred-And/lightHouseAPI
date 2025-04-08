/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `orderId` column on the `Expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Provider` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Provider` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `productId` on the `Inventory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderId` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `providerId` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_providerId_fkey";

-- Create temporary tables with new structure
CREATE TABLE "Category_new" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_new_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Customer_new" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_new_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Provider_new" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Provider_new_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Product_new" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rawPrice" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "sku" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    CONSTRAINT "Product_new_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order_new" (
    "id" SERIAL NOT NULL,
    "orderDate" TIMESTAMP(3),
    "orderNumber" TEXT NOT NULL,
    "productionStatus" TEXT,
    "clientName" TEXT,
    "description" TEXT,
    "productUnityCost" DECIMAL(65,30),
    "totalCost" DECIMAL(65,30),
    "finalCustomerPriceUnity" DECIMAL(65,30),
    "finalCustomerPrice" DECIMAL(65,30),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" INTEGER NOT NULL,
    CONSTRAINT "Order_new_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Inventory_new" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "minimumQuantity" INTEGER NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Inventory_new_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem_new" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "printId" TEXT,
    CONSTRAINT "OrderItem_new_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Expense_new" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "movementType" TEXT NOT NULL,
    "rawValue" DECIMAL(65,30) NOT NULL,
    "hasIva" BOOLEAN NOT NULL DEFAULT false,
    "discountAmount" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" INTEGER,
    CONSTRAINT "Expense_new_pkey" PRIMARY KEY ("id")
);

-- Copy data from old tables to new tables
INSERT INTO "Category_new" ("name", "description", "createdAt", "updatedAt")
SELECT "name", "description", "createdAt", "updatedAt" FROM "Category";

INSERT INTO "Customer_new" ("name", "email", "phone", "address", "notes", "createdAt", "updatedAt")
SELECT "name", "email", "phone", "address", "notes", "createdAt", "updatedAt" FROM "Customer";

INSERT INTO "Provider_new" ("name", "contactPerson", "email", "phone", "address", "createdAt", "updatedAt")
SELECT "name", "contactPerson", "email", "phone", "address", "createdAt", "updatedAt" FROM "Provider";

-- Create mapping tables for IDs
CREATE TABLE "category_id_mapping" AS
SELECT "id" as old_id, ROW_NUMBER() OVER (ORDER BY "id") as new_id
FROM "Category";

CREATE TABLE "customer_id_mapping" AS
SELECT "id" as old_id, ROW_NUMBER() OVER (ORDER BY "id") as new_id
FROM "Customer";

CREATE TABLE "provider_id_mapping" AS
SELECT "id" as old_id, ROW_NUMBER() OVER (ORDER BY "id") as new_id
FROM "Provider";

-- Copy data with mapped IDs
INSERT INTO "Product_new" ("name", "description", "rawPrice", "totalPrice", "sku", "createdAt", "updatedAt", "categoryId", "providerId")
SELECT p."name", p."description", p."rawPrice", p."totalPrice", p."sku", p."createdAt", p."updatedAt",
       c.new_id as "categoryId", pr.new_id as "providerId"
FROM "Product" p
JOIN "category_id_mapping" c ON p."categoryId" = c.old_id
JOIN "provider_id_mapping" pr ON p."providerId" = pr.old_id;

INSERT INTO "Order_new" ("orderDate", "orderNumber", "productionStatus", "clientName", "description", "productUnityCost", "totalCost", "finalCustomerPriceUnity", "finalCustomerPrice", "notes", "createdAt", "updatedAt", "customerId")
SELECT o."orderDate", o."orderNumber", o."productionStatus", o."clientName", o."description", o."productUnityCost", o."totalCost", o."finalCustomerPriceUnity", o."finalCustomerPrice", o."notes", o."createdAt", o."updatedAt",
       c.new_id as "customerId"
FROM "Order" o
JOIN "customer_id_mapping" c ON o."customerId" = c.old_id;

-- Create mapping tables for Product and Order IDs
CREATE TABLE "product_id_mapping" AS
SELECT "id" as old_id, ROW_NUMBER() OVER (ORDER BY "id") as new_id
FROM "Product";

CREATE TABLE "order_id_mapping" AS
SELECT "id" as old_id, ROW_NUMBER() OVER (ORDER BY "id") as new_id
FROM "Order";

-- Copy remaining data with mapped IDs
INSERT INTO "Inventory_new" ("quantity", "minimumQuantity", "location", "createdAt", "updatedAt", "productId")
SELECT i."quantity", i."minimumQuantity", i."location", i."createdAt", i."updatedAt",
       p.new_id as "productId"
FROM "Inventory" i
JOIN "product_id_mapping" p ON i."productId" = p.old_id;

INSERT INTO "OrderItem_new" ("quantity", "unitPrice", "confirmed", "createdAt", "updatedAt", "orderId", "productId", "printId")
SELECT oi."quantity", oi."unitPrice", oi."confirmed", oi."createdAt", oi."updatedAt",
       o.new_id as "orderId", p.new_id as "productId", oi."printId"
FROM "OrderItem" oi
JOIN "order_id_mapping" o ON oi."orderId" = o.old_id
JOIN "product_id_mapping" p ON oi."productId" = p.old_id;

INSERT INTO "Expense_new" ("description", "date", "movementType", "rawValue", "hasIva", "discountAmount", "createdAt", "updatedAt", "orderId")
SELECT e."description", e."date", e."movementType", e."rawValue", e."hasIva", e."discountAmount", e."createdAt", e."updatedAt",
       o.new_id as "orderId"
FROM "Expense" e
LEFT JOIN "order_id_mapping" o ON e."orderId" = o.old_id;

-- Drop old tables
DROP TABLE "Expense";
DROP TABLE "OrderItem";
DROP TABLE "Inventory";
DROP TABLE "Product";
DROP TABLE "Order";
DROP TABLE "Customer";
DROP TABLE "Provider";
DROP TABLE "Category";

-- Drop mapping tables
DROP TABLE "category_id_mapping";
DROP TABLE "customer_id_mapping";
DROP TABLE "provider_id_mapping";
DROP TABLE "product_id_mapping";
DROP TABLE "order_id_mapping";

-- Rename new tables
ALTER TABLE "Category_new" RENAME TO "Category";
ALTER TABLE "Customer_new" RENAME TO "Customer";
ALTER TABLE "Provider_new" RENAME TO "Provider";
ALTER TABLE "Product_new" RENAME TO "Product";
ALTER TABLE "Order_new" RENAME TO "Order";
ALTER TABLE "Inventory_new" RENAME TO "Inventory";
ALTER TABLE "OrderItem_new" RENAME TO "OrderItem";
ALTER TABLE "Expense_new" RENAME TO "Expense";

-- Add indexes and constraints
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE INDEX "Order_productionStatus_idx" ON "Order"("productionStatus");
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- Add foreign key constraints
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
