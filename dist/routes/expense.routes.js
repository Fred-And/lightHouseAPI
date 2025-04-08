"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseRoutes = expenseRoutes;
const expense_service_1 = require("../services/expense.service");
async function expenseRoutes(fastify) {
    const expenseService = new expense_service_1.ExpenseService();
    fastify.get("/", async (request, reply) => {
        try {
            const expenses = await expenseService.findAll();
            return expenses;
        }
        catch (error) {
            reply.status(500).send({
                error: "Failed to fetch expenses: " + error.message,
            });
        }
    });
    fastify.get("/balance", async (request, reply) => {
        try {
            const balance = await expenseService.getBalance();
            return balance;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch balance" });
        }
    });
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const expense = await expenseService.findById(id);
            if (!expense) {
                return reply.status(404).send({ error: "Expense not found" });
            }
            return expense;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch expense" });
        }
    });
    fastify.post("/", async (request, reply) => {
        try {
            const expense = await expenseService.create(request.body);
            return expense;
        }
        catch (error) {
            reply.status(500).send({
                error: "Failed to create expense: " + error.message,
            });
        }
    });
    fastify.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const expense = await expenseService.update(id, request.body);
            if (!expense) {
                return reply.status(404).send({ error: "Expense not found" });
            }
            return expense;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to update expense" });
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const success = await expenseService.delete(id);
            if (!success) {
                return reply.status(404).send({ error: "Expense not found" });
            }
            return { message: "Expense deleted successfully" };
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to delete expense" });
        }
    });
}
