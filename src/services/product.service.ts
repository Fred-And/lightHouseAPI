import { PrismaClient } from "@prisma/client";
import { calculateIva } from "../helpers/calculate_iva";

export class ProductService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        provider: true,
        inventory: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        provider: true,
        inventory: true,
      },
    });
  }

  async create(data: any) {
    const totalPrice = calculateIva(Number(data.rawPrice));
    return this.prisma.product.create({
      data: {
        ...data,
        totalPrice,
      },
      include: {
        category: true,
        provider: true,
        inventory: true,
      },
    });
  }

  async update(id: number, data: any) {
    const totalPrice = calculateIva(Number(data.rawPrice));
    return this.prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...data,
        totalPrice,
      },
      include: {
        category: true,
        provider: true,
        inventory: true,
      },
    });
  }

  async delete(id: number) {
    try {
      await this.prisma.product.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
