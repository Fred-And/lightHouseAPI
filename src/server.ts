import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import cookie from "@fastify/cookie";
import { customerRoutes } from "./routes/customer.routes";
import { productRoutes } from "./routes/product.routes";
import { orderRoutes } from "./routes/order.routes";
import { categoryRoutes } from "./routes/category.routes";
import { providerRoutes } from "./routes/provider.routes";
import { inventoryRoutes } from "./routes/inventory.routes";
import { expenseRoutes } from "./routes/expense.routes";
import { authRoutes } from "./routes/auth.routes";

const fastify = Fastify({
  logger: true,
});

// Register plugins
fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET || "your-secret-key", // for signed cookies
  hook: "onRequest",
});

fastify.register(cors, {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://manager.lhbranded.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || "your-secret-key",
});

fastify.register(swagger, {
  swagger: {
    info: {
      title: "Business Manager API",
      description: "API documentation",
      version: "1.0.0",
    },
  },
});

// Register routes
fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(customerRoutes, { prefix: "/api/customers" });
fastify.register(productRoutes, { prefix: "/api/products" });
fastify.register(orderRoutes, { prefix: "/api/orders" });
fastify.register(categoryRoutes, { prefix: "/api/categories" });
fastify.register(providerRoutes, { prefix: "/api/providers" });
fastify.register(inventoryRoutes, { prefix: "/api/inventory" });
fastify.register(expenseRoutes, { prefix: "/api/expenses" });

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server is running on port 3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
