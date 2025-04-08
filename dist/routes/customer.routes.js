"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = customerRoutes;
const customer_service_1 = require("../services/customer.service");
async function customerRoutes(fastify) {
    const customerService = new customer_service_1.CustomerService();
    fastify.get("/", async (request, reply) => {
        try {
            const customers = await customerService.findAll();
            return customers;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch customers" });
        }
    });
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const customer = await customerService.findById(id);
            if (!customer) {
                return reply.status(404).send({ error: "Customer not found" });
            }
            return customer;
        }
        catch (error) {
            console.error("Error in GET /:id route:", error);
            reply.status(500).send({
                error: "Failed to fetch customer",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
    fastify.post("/", async (request, reply) => {
        try {
            const customer = await customerService.create(request.body);
            return reply.status(201).send(customer);
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to create customer" });
        }
    });
    fastify.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const customer = await customerService.update(id, request.body);
            if (!customer) {
                return reply.status(404).send({ error: "Customer not found" });
            }
            return customer;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to update customer" });
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const success = await customerService.delete(id);
            if (!success) {
                return reply.status(404).send({ error: "Customer not found" });
            }
            return reply.status(204).send();
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to delete customer" });
        }
    });
}
