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

  async create(data: any) {
    try {
      const { items, ...orderData } = data;

      const mappedItems = items.map((item: any) => ({
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

      return this.prisma.order.create({
        data: {
          ...orderData,
          totalCost: new Prisma.Decimal(totalCost),
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
