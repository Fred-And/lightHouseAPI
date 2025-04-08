import { FastifyInstance } from "fastify";
import { OrderService } from "../services/order.service";

const orderItemSchema = {
  type: "object",
  required: ["productId", "quantity", "productUnitPrice", "printUnitPrice"],
  properties: {
    id: { type: "number" },
    productId: { type: "number" },
    printId: { type: "number" },
    quantity: { type: "number" },
    productUnitPrice: { type: "number" },
    printUnitPrice: { type: "number" },
  },
};

const createOrderSchema = {
  schema: {
    body: {
      type: "object",
      required: [
        "customerId",
        "orderNumber",
        "productionStatus",
        "orderDate",
        "items",
      ],
      properties: {
        customerId: { type: "number" },
        orderNumber: { type: "string" },
        productionStatus: { type: "string" },
        orderDate: { type: "string", format: "date-time" },
        description: { type: "string" },
        items: {
          type: "array",
          minItems: 1,
          items: orderItemSchema,
        },
      },
    },
  },
};

export async function orderRoutes(fastify: FastifyInstance) {
  const orderService = new OrderService();

  fastify.get("/", async (request, reply) => {
    try {
      const orders = await orderService.findAll();
      return orders;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch orders" });
    }
  });

  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const order = await orderService.findById(Number(id));
      if (!order) {
        return reply.status(404).send({ error: "Order not found" });
      }
      return order;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch order" });
    }
  });

  fastify.post("/", createOrderSchema, async (request, reply) => {
    try {
      const order = await orderService.create(request.body);
      return order;
    } catch (error) {
      console.error("Order creation error:", error);
      reply.status(500).send({ error: "Failed to create order" });
    }
  });

  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const order = await orderService.update(Number(id), request.body);
      if (!order) {
        return reply.status(404).send({ error: "Order not found" });
      }
      return order;
    } catch (error) {
      reply.status(500).send({ error: "Failed to update order" });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const success = await orderService.delete(Number(id));
      if (!success) {
        return reply.status(404).send({ error: "Order not found" });
      }
      return { message: "Order deleted successfully" };
    } catch (error) {
      reply.status(500).send({ error: "Failed to delete order" });
    }
  });
}
