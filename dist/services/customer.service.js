"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CustomerService {
    async findAll() {
        return prisma.customer.findMany();
    }
    async findById(id) {
        return prisma.customer.findUnique({
            where: { id: parseInt(id) },
        });
    }
    async create(data) {
        return prisma.customer.create({
            data,
        });
    }
    async update(id, data) {
        return prisma.customer.update({
            where: { id: parseInt(id) },
            data,
        });
    }
    async delete(id) {
        return prisma.customer.delete({
            where: { id: parseInt(id) },
        });
    }
}
exports.CustomerService = CustomerService;
