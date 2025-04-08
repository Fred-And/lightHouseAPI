import { FastifyInstance } from "fastify";
import { InventoryService } from "../services/inventory.service";
import { authenticate } from "../middleware/auth.middleware";

export async function inventoryRoutes(fastify: FastifyInstance) {
  const inventoryService = new InventoryService();
  fastify.addHook("onRequest", authenticate);
  fastify.get("/", async (request, reply) => {
    try {
      const inventory = await inventoryService.findAll();
      return inventory;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch inventory" });
    }
  });

  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const inventory = await inventoryService.findById(id);
      if (!inventory) {
        return reply.status(404).send({ error: "Inventory not found" });
      }
      return inventory;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch inventory" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const inventory = await inventoryService.create(request.body);
      return inventory;
    } catch (error) {
      reply.status(500).send({ error: "Failed to create inventory" });
    }
  });

  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const inventory = await inventoryService.update(id, request.body);
      if (!inventory) {
        return reply.status(404).send({ error: "Inventory not found" });
      }
      return inventory;
    } catch (error) {
      reply.status(500).send({ error: "Failed to update inventory" });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const success = await inventoryService.delete(id);
      if (!success) {
        return reply.status(404).send({ error: "Inventory not found" });
      }
      return { message: "Inventory deleted successfully" };
    } catch (error) {
      reply.status(500).send({ error: "Failed to delete inventory" });
    }
  });
}
