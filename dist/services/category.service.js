"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
class CategoryService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findAll() {
        return this.prisma.category.findMany({
            include: {
                products: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                products: true,
            },
        });
    }
    async create(data) {
        return this.prisma.category.create({
            data,
            include: {
                products: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.category.update({
            where: { id: parseInt(id) },
            data,
            include: {
                products: true,
            },
        });
    }
    async delete(id) {
        try {
            await this.prisma.category.delete({
                where: { id: parseInt(id) },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.CategoryService = CategoryService;
