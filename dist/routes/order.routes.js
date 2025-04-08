"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = orderRoutes;
const order_service_1 = require("../services/order.service");
async function orderRoutes(fastify) {
    const orderService = new order_service_1.OrderService();
    fastify.get("/", async (request, reply) => {
        try {
            const orders = await orderService.findAll();
            return orders;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch orders" });
        }
    });
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const order = await orderService.findById(id);
            if (!order) {
                return reply.status(404).send({ error: "Order not found" });
            }
            return order;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch order" });
        }
    });
    fastify.post("/", async (request, reply) => {
        try {
            const order = await orderService.create(request.body);
            return order;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to create order" });
        }
    });
    fastify.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const order = await orderService.update(id, request.body);
            if (!order) {
                return reply.status(404).send({ error: "Order not found" });
            }
            return order;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to update order" });
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const success = await orderService.delete(id);
            if (!success) {
                return reply.status(404).send({ error: "Order not found" });
            }
            return { message: "Order deleted successfully" };
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to delete order" });
        }
    });
}
