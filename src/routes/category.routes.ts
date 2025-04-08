import { FastifyInstance } from "fastify";
import { CategoryService } from "../services/category.service";
import { authenticate } from "../middleware/auth.middleware";

export async function categoryRoutes(fastify: FastifyInstance) {
  const categoryService = new CategoryService();
  fastify.addHook("onRequest", authenticate);
  fastify.get("/", async (request, reply) => {
    try {
      const categories = await categoryService.findAll();
      return categories;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch categories" });
    }
  });

  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const category = await categoryService.findById(id);
      if (!category) {
        return reply.status(404).send({ error: "Category not found" });
      }
      return category;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch category" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const category = await categoryService.create(request.body);
      return category;
    } catch (error) {
      reply.status(500).send({ error: "Failed to create category" });
    }
  });

  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const category = await categoryService.update(id, request.body);
      if (!category) {
        return reply.status(404).send({ error: "Category not found" });
      }
      return category;
    } catch (error) {
      reply.status(500).send({ error: "Failed to update category" });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const success = await categoryService.delete(id);
      if (!success) {
        return reply.status(404).send({ error: "Category not found" });
      }
      return { message: "Category deleted successfully" };
    } catch (error) {
      reply.status(500).send({ error: "Failed to delete category" });
    }
  });
}
