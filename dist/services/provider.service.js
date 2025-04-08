"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const client_1 = require("@prisma/client");
class ProviderService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findAll() {
        return this.prisma.provider.findMany({
            include: {
                products: true,
            },
        });
    }
    async findById(id) {
        try {
            const provider = await this.prisma.provider.findUnique({
                where: { id: Number(id) },
                include: {
                    products: true,
                },
            });
            return provider;
        }
        catch (error) {
            console.error("Error finding provider:", error);
            throw error;
        }
    }
    async create(data) {
        return this.prisma.provider.create({
            data,
            include: {
                products: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.provider.update({
            where: { id: Number(id) },
            data,
            include: {
                products: true,
            },
        });
    }
    async delete(id) {
        try {
            await this.prisma.provider.delete({
                where: { id: Number(id) },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.ProviderService = ProviderService;
