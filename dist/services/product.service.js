"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const calculate_iva_1 = require("../helpers/calculate_iva");
class ProductService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
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
    async findById(id) {
        return this.prisma.product.findUnique({
            where: { id: Number(id) },
            include: {
                category: true,
                provider: true,
                inventory: true,
            },
        });
    }
    async create(data) {
        const totalPrice = (0, calculate_iva_1.calculateIva)(Number(data.rawPrice));
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
    async update(id, data) {
        const totalPrice = (0, calculate_iva_1.calculateIva)(Number(data.rawPrice));
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
    async delete(id) {
        try {
            await this.prisma.product.delete({
                where: { id: Number(id) },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.ProductService = ProductService;
