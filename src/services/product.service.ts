import { PrismaClient, Prisma } from "@prisma/client";
import { calculateProductFinalPrice } from "../helpers/calculate_iva";
import { ProductCreateData } from "../types/product.types";

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

  async create(data: ProductCreateData) {
    // Calculate the raw price (base cost from supplier)
    const rawPrice = data.baseCost;

    // Note: We're not using the total cost calculation here as we're storing individual components
    // This allows for more flexibility when editing products later

    // Calculate the final price with margin
    const totalPrice = calculateProductFinalPrice({
      baseCost: data.baseCost,
      printCost: data.printCost,
      packagingCost: data.packagingCost,
      shippingCost: data.shippingCost,
      laborCost: data.laborCost,
      marginPercentage: data.marginPercentage,
    });

    // Create the product with the calculated prices and all pricing components
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        categoryId: data.categoryId,
        providerId: data.providerId,
        rawPrice: new Prisma.Decimal(rawPrice),
        totalPrice: new Prisma.Decimal(totalPrice),
        printCost: data.printCost ? new Prisma.Decimal(data.printCost) : null,
        packagingCost: data.packagingCost
          ? new Prisma.Decimal(data.packagingCost)
          : null,
        shippingCost: data.shippingCost
          ? new Prisma.Decimal(data.shippingCost)
          : null,
        laborCost: data.laborCost ? new Prisma.Decimal(data.laborCost) : null,
        marginPercentage: data.marginPercentage || 30,
      },
      include: {
        category: true,
        provider: true,
        inventory: true,
      },
    });
  }

  async update(id: number, data: ProductCreateData) {
    // Calculate the raw price (base cost from supplier)
    const rawPrice = data.baseCost;

    // Calculate the final price with margin
    const totalPrice = calculateProductFinalPrice({
      baseCost: data.baseCost,
      printCost: data.printCost,
      packagingCost: data.packagingCost,
      shippingCost: data.shippingCost,
      laborCost: data.laborCost,
      marginPercentage: data.marginPercentage,
    });

    // Update the product with the calculated prices and all pricing components
    return this.prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        categoryId: data.categoryId,
        providerId: data.providerId,
        rawPrice: new Prisma.Decimal(rawPrice),
        totalPrice: new Prisma.Decimal(totalPrice),
        printCost: data.printCost ? new Prisma.Decimal(data.printCost) : null,
        packagingCost: data.packagingCost
          ? new Prisma.Decimal(data.packagingCost)
          : null,
        shippingCost: data.shippingCost
          ? new Prisma.Decimal(data.shippingCost)
          : null,
        laborCost: data.laborCost ? new Prisma.Decimal(data.laborCost) : null,
        marginPercentage: data.marginPercentage || 30,
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
