"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = categoryRoutes;
const category_service_1 = require("../services/category.service");
async function categoryRoutes(fastify) {
    const categoryService = new category_service_1.CategoryService();
    fastify.get("/", async (request, reply) => {
        try {
            const categories = await categoryService.findAll();
            return categories;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch categories" });
        }
    });
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const category = await categoryService.findById(id);
            if (!category) {
                return reply.status(404).send({ error: "Category not found" });
            }
            return category;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch category" });
        }
    });
    fastify.post("/", async (request, reply) => {
        try {
            const category = await categoryService.create(request.body);
            return category;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to create category" });
        }
    });
    fastify.put("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const category = await categoryService.update(id, request.body);
            if (!category) {
                return reply.status(404).send({ error: "Category not found" });
            }
            return category;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to update category" });
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const success = await categoryService.delete(id);
            if (!success) {
                return reply.status(404).send({ error: "Category not found" });
            }
            return { message: "Category deleted successfully" };
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to delete category" });
        }
    });
}
