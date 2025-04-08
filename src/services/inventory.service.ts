import { PrismaClient } from "@prisma/client";

export class InventoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return this.prisma.inventory.findMany({
      include: {
        product: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.inventory.create({
      data,
      include: {
        product: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.inventory.update({
      where: { id },
      data,
      include: {
        product: true,
      },
    });
  }

  async delete(id: string) {
    try {
      await this.prisma.inventory.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
