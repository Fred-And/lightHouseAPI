"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = productRoutes;
const product_service_1 = require("../services/product.service");
async function productRoutes(fastify) {
    const productService = new product_service_1.ProductService();
    fastify.get("/", async (request, reply) => {
        try {
            const products = await productService.findAll();
            return products;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch products" });
        }
    });
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const product = await productService.findById(id);
            if (!product) {
                return reply.status(404).send({ error: "Product not found" });
            }
            return product;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch product" });
        }
    });
    fastify.post("/", async (request, reply) => {
        try {
            const product = await productService.create(request.body);
            return product;
        }
        catch (error) {
            reply.status(500).send({
                error: "Failed to create product: " + error.message,
            });
        }
    });
    fastify.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const product = await productService.update(id, request.body);
            if (!product) {
                return reply.status(404).send({ error: "Product not found" });
            }
            return product;
        }
        catch (error) {
            reply.status(500).send({
                error: "Failed to update product: " + error.message,
            });
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const success = await productService.delete(id);
            if (!success) {
                return reply.status(404).send({ error: "Product not found" });
            }
            return { message: "Product deleted successfully" };
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to delete product" });
        }
    });
}
