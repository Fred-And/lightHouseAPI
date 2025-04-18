import { PrismaClient, Prisma } from "@prisma/client";
import {
  calculateProductTotalArray,
  calculateProductRawTotalArray,
} from "../helpers/calculate_iva";
import { OrderCreateData, OrderUpdateData } from "../types/order.types";

export class OrderService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
            print: true,
          },
        },
        expenses: true,
      },
    });

    return orders.map((order) => ({
      ...order,
      totalCost: order.totalCost ? Number(order.totalCost.toFixed(2)) : null,
      finalCustomerPrice: order.finalCustomerPrice
        ? Number(order.finalCustomerPrice.toFixed(2))
        : null,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice.toFixed(2)),
        total: Number(item.total.toFixed(2)),
      })),
    }));
  }

  async findById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
            print: true,
          },
        },
        expenses: true,
      },
    });

    if (!order) return null;

    return {
      ...order,
      totalCost: order.totalCost ? Number(order.totalCost.toFixed(2)) : null,
      finalCustomerPrice: order.finalCustomerPrice
        ? Number(order.finalCustomerPrice.toFixed(2))
        : null,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice.toFixed(2)),
        total: Number(item.total.toFixed(2)),
      })),
    };
  }

  // Helper method to create order items with pricing components
  private async createOrderItems(items: any[]) {
    const orderItems = [];

    for (const item of items) {
      // Calculate unit price and total
      const unitPrice =
        Number(item.productUnitPrice) + Number(item.printUnitPrice || 0);
      const total = unitPrice * Number(item.quantity);

      if (isNaN(unitPrice) || isNaN(total)) {
        throw new Error(
          `Invalid calculation for item: ${JSON.stringify(item)}`
        );
      }

      // Get the product to access its pricing components
      const product = await this.prisma.product.findUnique({
        where: { id: Number(item.productId) },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Check if the product has the expected properties
      console.log("Product found:", {
        productId: item.productId,
        productRawPrice: product.rawPrice,
        productRawPriceType: typeof product.rawPrice,
        productRawPriceIsDecimal: product.rawPrice instanceof Prisma.Decimal,
        productHasRawPrice: "rawPrice" in product,
        productObjectKeys: Object.keys(product),
      });

      // Get the print product if it exists
      let print = null;
      if (item.printId) {
        print = await this.prisma.product.findUnique({
          where: { id: Number(item.printId) },
        });

        if (!print) {
          throw new Error(`Print product with ID ${item.printId} not found`);
        }

        // Check if the print product has the expected properties
        console.log("Print product found:", {
          printId: item.printId,
          printRawPrice: print.rawPrice,
          printRawPriceType: typeof print.rawPrice,
          printRawPriceIsDecimal: print.rawPrice instanceof Prisma.Decimal,
          printHasRawPrice: "rawPrice" in print,
          printObjectKeys: Object.keys(print),
          printObject: JSON.stringify(print),
        });
      }

      // Create the order item data with pricing components
      const orderItemData = {
        productId: Number(item.productId),
        printId: item.printId ? Number(item.printId) : null,
        quantity: Number(item.quantity),
        unitPrice: new Prisma.Decimal(unitPrice),
        total: new Prisma.Decimal(total),

        // Store pricing components as they are at the time of order creation
        // Handle the baseCost based on available data
        baseCost: (() => {
          if (product && product.rawPrice) {
            console.log(
              "Using product.rawPrice for baseCost:",
              product.rawPrice
            );
            return product.rawPrice; // Use the product's rawPrice
          } else {
            console.log(
              "Using item.productUnitPrice for baseCost:",
              item.productUnitPrice
            );
            return new Prisma.Decimal(Number(item.productUnitPrice)); // Use the provided productUnitPrice
          }
        })(),
        // Handle the printCost based on available data
        printCost: (() => {
          if (print && print.rawPrice) {
            console.log("Using print.rawPrice:", print.rawPrice);
            return print.rawPrice; // Use the print product's rawPrice
          } else if (item.printUnitPrice) {
            console.log("Using item.printUnitPrice:", item.printUnitPrice);
            return new Prisma.Decimal(Number(item.printUnitPrice)); // Use the provided printUnitPrice
          } else if (product.printCost) {
            console.log("Using product.printCost:", product.printCost);
            return product.printCost; // Use the product's own printCost
          } else {
            console.log("No print cost available, using null");
            return null; // No print cost
          }
        })(),
        packagingCost: product.packagingCost || null,
        shippingCost: product.shippingCost || null,
        laborCost: product.laborCost || null,
        marginPercentage: product.marginPercentage || 30,
      };

      // Log the order item data for debugging
      console.log("Creating order item with data:", {
        productId: orderItemData.productId,
        printId: orderItemData.printId,
        baseCost: orderItemData.baseCost,
        printCost: orderItemData.printCost,
        packagingCost: orderItemData.packagingCost,
        shippingCost: orderItemData.shippingCost,
        laborCost: orderItemData.laborCost,
        marginPercentage: orderItemData.marginPercentage,
      });

      // Add the order item to the array
      orderItems.push(orderItemData);
    }

    return orderItems;
  }

  async create(data: OrderCreateData) {
    try {
      const { items, ...orderData } = data;

      const mappedItems = items.map((item) => ({
        productPrice: Number(item.productUnitPrice),
        printPrice: Number(item.printUnitPrice || 0),
        quantity: Number(item.quantity),
        serviceFee: 1.4,
      }));

      const totalCost = calculateProductRawTotalArray(mappedItems);
      const finalCustomerPrice = calculateProductTotalArray(mappedItems);

      if (isNaN(totalCost) || isNaN(finalCustomerPrice)) {
        throw new Error("Invalid calculation result: check input values");
      }

      // Create order items with pricing components
      const orderItems = await this.createOrderItems(items);

      return this.prisma.order.create({
        data: {
          ...orderData,
          totalCost: new Prisma.Decimal(totalCost),
          finalCustomerPrice: new Prisma.Decimal(finalCustomerPrice),
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
              print: true,
            },
          },
          expenses: true,
        },
      });
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  }

  async update(id: number, data: OrderUpdateData) {
    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        customer: true,
        orderItems: true,
        expenses: true,
      },
    });
  }

  async delete(id: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          orderItems: true,
          expenses: true,
        },
      });

      if (!order) {
        return false;
      }

      await this.prisma.$transaction(async (tx) => {
        if (order.orderItems.length > 0) {
          await tx.orderItem.deleteMany({
            where: { orderId: id },
          });
        }

        if (order.expenses.length > 0) {
          await tx.expense.deleteMany({
            where: { orderId: id },
          });
        }

        await tx.order.delete({
          where: { id },
        });
      });

      return true;
    } catch (error) {
      console.error("Order deletion error:", error);
      throw error;
    }
  }
}
