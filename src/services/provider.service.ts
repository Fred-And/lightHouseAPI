import { PrismaClient } from "@prisma/client";

export class ProviderService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return this.prisma.provider.findMany({
      include: {
        products: true,
      },
    });
  }

  async findById(id: number) {
    try {
      const provider = await this.prisma.provider.findUnique({
        where: { id: Number(id) },
        include: {
          products: true,
        },
      });
      return provider;
    } catch (error) {
      console.error("Error finding provider:", error);
      throw error;
    }
  }

  async create(data: any) {
    return this.prisma.provider.create({
      data,
      include: {
        products: true,
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.provider.update({
      where: { id: Number(id) },
      data,
      include: {
        products: true,
      },
    });
  }

  async delete(id: number) {
    try {
      await this.prisma.provider.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
