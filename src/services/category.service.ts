import { PrismaClient } from "@prisma/client";

export class CategoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.category.create({
      data,
      include: {
        products: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.category.update({
      where: { id: parseInt(id) },
      data,
      include: {
        products: true,
      },
    });
  }

  async delete(id: string) {
    try {
      await this.prisma.category.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
