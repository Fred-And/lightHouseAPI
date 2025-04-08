"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const client_1 = require("@prisma/client");
class ExpenseService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findAll() {
        return this.prisma.expense.findMany({
            include: {
                order: true,
            },
        });
    }
    async getBalance() {
        const expenses = await this.prisma.expense.findMany({
            select: {
                rawValue: true,
                movementType: true,
            },
        });
        const totalIncome = expenses
            .filter((expense) => expense.movementType === "income")
            .reduce((acc, expense) => acc + Number(expense.rawValue), 0);
        const totalExpenses = expenses
            .filter((expense) => expense.movementType === "expense")
            .reduce((acc, expense) => acc + Number(expense.rawValue), 0);
        const balance = totalIncome - totalExpenses;
        return {
            totalIncome: Number(totalIncome.toFixed(2)),
            totalExpenses: Number(totalExpenses.toFixed(2)),
            balance: Number(balance.toFixed(2)),
        };
    }
    async findById(id) {
        return this.prisma.expense.findUnique({
            where: { id },
            include: {
                order: true,
            },
        });
    }
    async create(data) {
        return this.prisma.expense.create({
            data,
            include: {
                order: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.expense.update({
            where: { id },
            data,
            include: {
                order: true,
            },
        });
    }
    async delete(id) {
        try {
            await this.prisma.expense.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.ExpenseService = ExpenseService;
