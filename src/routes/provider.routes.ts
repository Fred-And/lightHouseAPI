import { FastifyInstance } from "fastify";
import { ProviderService } from "../services/provider.service";
import { authenticate } from "../middleware/auth.middleware";

export async function providerRoutes(fastify: FastifyInstance) {
  const providerService = new ProviderService();
  fastify.addHook("onRequest", authenticate);

  fastify.get("/", async (request, reply) => {
    try {
      const providers = await providerService.findAll();
      return providers;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch providers" });
    }
  });

  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      const provider = await providerService.findById(id);
      if (!provider) {
        return reply.status(404).send({ error: "Provider not found" });
      }
      return provider;
    } catch (error) {
      console.error("Error in GET /:id route:", error);
      reply.status(500).send({
        error: "Failed to fetch provider",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const provider = await providerService.create(request.body);
      return provider;
    } catch (error) {
      reply.status(500).send({ error: "Failed to create provider" });
    }
  });

  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      const provider = await providerService.update(id, request.body);
      if (!provider) {
        return reply.status(404).send({ error: "Provider not found" });
      }
      return provider;
    } catch (error) {
      reply.status(500).send({ error: "Failed to update provider" });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      const success = await providerService.delete(id);
      if (!success) {
        return reply.status(404).send({ error: "Provider not found" });
      }
      return { message: "Provider deleted successfully" };
    } catch (error) {
      reply.status(500).send({ error: "Failed to delete provider" });
    }
  });
}
