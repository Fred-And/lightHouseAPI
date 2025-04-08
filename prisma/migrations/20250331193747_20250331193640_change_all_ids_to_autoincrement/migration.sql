-- AlterTable
ALTER TABLE "Category" RENAME CONSTRAINT "Category_new_pkey" TO "Category_pkey";

-- AlterTable
ALTER TABLE "Customer" RENAME CONSTRAINT "Customer_new_pkey" TO "Customer_pkey";

-- AlterTable
ALTER TABLE "Expense" RENAME CONSTRAINT "Expense_new_pkey" TO "Expense_pkey";

-- AlterTable
ALTER TABLE "Inventory" RENAME CONSTRAINT "Inventory_new_pkey" TO "Inventory_pkey";

-- AlterTable
ALTER TABLE "Order" RENAME CONSTRAINT "Order_new_pkey" TO "Order_pkey";

-- AlterTable
ALTER TABLE "OrderItem" RENAME CONSTRAINT "OrderItem_new_pkey" TO "OrderItem_pkey";

-- AlterTable
ALTER TABLE "Product" RENAME CONSTRAINT "Product_new_pkey" TO "Product_pkey";

-- AlterTable
ALTER TABLE "Provider" RENAME CONSTRAINT "Provider_new_pkey" TO "Provider_pkey";
