import { PrismaClient } from "@prisma/client";

export class ExpenseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return this.prisma.expense.findMany({
      include: {
        order: true,
      },
    });
  }

  async getBalance() {
    const expenses = await this.prisma.expense.findMany({
      select: {
        rawValue: true,
        movementType: true,
      },
    });

    const totalIncome = expenses
      .filter((expense) => expense.movementType === "income")
      .reduce((acc, expense) => acc + Number(expense.rawValue), 0);

    const totalExpenses = expenses
      .filter((expense) => expense.movementType === "expense")
      .reduce((acc, expense) => acc + Number(expense.rawValue), 0);

    const balance = totalIncome - totalExpenses;

    return {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpenses: Number(totalExpenses.toFixed(2)),
      balance: Number(balance.toFixed(2)),
    };
  }

  async findById(id: string) {
    return this.prisma.expense.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.expense.create({
      data,
      include: {
        order: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.expense.update({
      where: { id },
      data,
      include: {
        order: true,
      },
    });
  }

  async delete(id: string) {
    try {
      await this.prisma.expense.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
