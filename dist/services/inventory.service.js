"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const client_1 = require("@prisma/client");
class InventoryService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findAll() {
        return this.prisma.inventory.findMany({
            include: {
                product: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.inventory.findUnique({
            where: { id },
            include: {
                product: true,
            },
        });
    }
    async create(data) {
        return this.prisma.inventory.create({
            data,
            include: {
                product: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.inventory.update({
            where: { id },
            data,
            include: {
                product: true,
            },
        });
    }
    async delete(id) {
        try {
            await this.prisma.inventory.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.InventoryService = InventoryService;
