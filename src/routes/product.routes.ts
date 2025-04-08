import { FastifyInstance } from "fastify";
import { ProductService } from "../services/product.service";

export async function productRoutes(fastify: FastifyInstance) {
  const productService = new ProductService();

  fastify.get("/", async (request, reply) => {
    try {
      const products = await productService.findAll();
      return products;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch products" });
    }
  });

  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      const product = await productService.findById(id);
      if (!product) {
        return reply.status(404).send({ error: "Product not found" });
      }
      return product;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch product" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const product = await productService.create(request.body);
      return product;
    } catch (error) {
      reply.status(500).send({
        error: "Failed to create product: " + (error as Error).message,
      });
    }
  });

  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      const product = await productService.update(id, request.body);
      if (!product) {
        return reply.status(404).send({ error: "Product not found" });
      }
      return product;
    } catch (error) {
      reply.status(500).send({
        error: "Failed to update product: " + (error as Error).message,
      });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      const success = await productService.delete(id);
      if (!success) {
        return reply.status(404).send({ error: "Product not found" });
      }
      return { message: "Product deleted successfully" };
    } catch (error) {
      reply.status(500).send({ error: "Failed to delete product" });
    }
  });
}
