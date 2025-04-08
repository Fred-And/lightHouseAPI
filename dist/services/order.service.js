"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
class OrderService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: {
                customer: true,
                orderItems: true,
                expenses: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                orderItems: true,
                expenses: true,
            },
        });
    }
    async create(data) {
        return this.prisma.order.create({
            data,
            include: {
                customer: true,
                orderItems: true,
                expenses: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.order.update({
            where: { id },
            data,
            include: {
                customer: true,
                orderItems: true,
                expenses: true,
            },
        });
    }
    async delete(id) {
        try {
            await this.prisma.order.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.OrderService = OrderService;
