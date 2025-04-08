"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRoutes = inventoryRoutes;
const inventory_service_1 = require("../services/inventory.service");
async function inventoryRoutes(fastify) {
    const inventoryService = new inventory_service_1.InventoryService();
    fastify.get("/", async (request, reply) => {
        try {
            const inventory = await inventoryService.findAll();
            return inventory;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch inventory" });
        }
    });
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const inventory = await inventoryService.findById(id);
            if (!inventory) {
                return reply.status(404).send({ error: "Inventory not found" });
            }
            return inventory;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch inventory" });
        }
    });
    fastify.post("/", async (request, reply) => {
        try {
            const inventory = await inventoryService.create(request.body);
            return inventory;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to create inventory" });
        }
    });
    fastify.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const inventory = await inventoryService.update(id, request.body);
            if (!inventory) {
                return reply.status(404).send({ error: "Inventory not found" });
            }
            return inventory;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to update inventory" });
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const success = await inventoryService.delete(id);
            if (!success) {
                return reply.status(404).send({ error: "Inventory not found" });
            }
            return { message: "Inventory deleted successfully" };
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to delete inventory" });
        }
    });
}
