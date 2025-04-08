"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerRoutes = providerRoutes;
const provider_service_1 = require("../services/provider.service");
async function providerRoutes(fastify) {
    const providerService = new provider_service_1.ProviderService();
    fastify.get("/", async (request, reply) => {
        try {
            const providers = await providerService.findAll();
            return providers;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch providers" });
        }
    });
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const provider = await providerService.findById(id);
            if (!provider) {
                return reply.status(404).send({ error: "Provider not found" });
            }
            return provider;
        }
        catch (error) {
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
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to create provider" });
        }
    });
    fastify.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const provider = await providerService.update(id, request.body);
            if (!provider) {
                return reply.status(404).send({ error: "Provider not found" });
            }
            return provider;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to update provider" });
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const success = await providerService.delete(id);
            if (!success) {
                return reply.status(404).send({ error: "Provider not found" });
            }
            return { message: "Provider deleted successfully" };
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to delete provider" });
        }
    });
}
