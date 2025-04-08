import { PrismaClient, Prisma } from "@prisma/client";
import {
  calculateProductRawTotal,
  calculateProductTotalArray,
  calculateProductRawTotalArray,
} from "../helpers/calculate_iva";

export class OrderService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        orderItems: true,
        expenses: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: true,
        expenses: true,
      },
    });
  }

  async create(data: any) {
    try {
      const { items, ...orderData } = data;

      // Map items to the format expected by helper functions
      const mappedItems = items.map((item: any) => ({
        productPrice: Number(item.productUnitPrice),
        printPrice: Number(item.printUnitPrice || 0),
        quantity: Number(item.quantity),
        serviceFee: 1.4, // Default markup, you might want to make this configurable
      }));

      const totalCost = calculateProductRawTotalArray(mappedItems);
      const finalCustomerPrice = calculateProductTotalArray(mappedItems);

      if (isNaN(totalCost) || isNaN(finalCustomerPrice)) {
        throw new Error("Invalid calculation result: check input values");
      }

      return this.prisma.order.create({
        data: {
          ...orderData,
          finalCustomerPrice: new Prisma.Decimal(finalCustomerPrice),
          orderItems: {
            create: items.map((item: any) => {
              const unitPrice =
                Number(item.productUnitPrice) +
                Number(item.printUnitPrice || 0);
              const total = calculateProductRawTotal(
                Number(item.productUnitPrice),
                Number(item.printUnitPrice || 0),
                Number(item.quantity)
              );

              if (isNaN(unitPrice) || isNaN(total)) {
                throw new Error(
                  `Invalid calculation for item: ${JSON.stringify(item)}`
                );
              }

              return {
                productId: Number(item.productId),
                printId: item.printId ? Number(item.printId) : null,
                quantity: Number(item.quantity),
                unitPrice: new Prisma.Decimal(unitPrice),
                total: new Prisma.Decimal(total),
              };
            }),
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

  async update(id: number, data: any) {
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
      await this.prisma.order.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
