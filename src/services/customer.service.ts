import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CustomerService {
  async findAll() {
    return prisma.customer.findMany();
  }

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async create(data: any) {
    return prisma.customer.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.customer.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async delete(id: string) {
    return prisma.customer.delete({
      where: { id: parseInt(id) },
    });
  }
}
