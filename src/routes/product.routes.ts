import { FastifyInstance } from "fastify";
import { ProductService } from "../services/product.service";
import { authenticate } from "../middleware/auth.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";
import { ProductCreateData } from "../types/product.types";

export async function productRoutes(fastify: FastifyInstance) {
  const productService = new ProductService();
  fastify.addHook("onRequest", authenticate);

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

  fastify.post("/", createProductSchema, async (request, reply) => {
    try {
      const productData = request.body as ProductCreateData;
      const product = await productService.create(productData);
      return reply.status(201).send(product);
    } catch (error) {
      console.error("Product creation error:", error);
      reply.status(500).send({
        error: "Failed to create product: " + (error as Error).message,
      });
    }
  });

  fastify.put("/:id", updateProductSchema, async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      const productData = request.body as ProductCreateData;
      const product = await productService.update(id, productData);
      if (!product) {
        return reply.status(404).send({ error: "Product not found" });
      }
      return product;
    } catch (error) {
      console.error("Product update error:", error);
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
