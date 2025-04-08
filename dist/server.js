"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const customer_routes_1 = require("./routes/customer.routes");
const product_routes_1 = require("./routes/product.routes");
const order_routes_1 = require("./routes/order.routes");
const category_routes_1 = require("./routes/category.routes");
const provider_routes_1 = require("./routes/provider.routes");
const inventory_routes_1 = require("./routes/inventory.routes");
const expense_routes_1 = require("./routes/expense.routes");
const auth_routes_1 = require("./routes/auth.routes");
const fastify = (0, fastify_1.default)({
    logger: true,
});
// Register plugins
fastify.register(cors_1.default, {
    origin: true, // Allow all origins during development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});
fastify.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || "your-secret-key",
});
fastify.register(swagger_1.default, {
    swagger: {
        info: {
            title: "Business Manager API",
            description: "API documentation",
            version: "1.0.0",
        },
    },
});
// Register routes
fastify.register(auth_routes_1.authRoutes, { prefix: "/api/auth" });
fastify.register(customer_routes_1.customerRoutes, { prefix: "/api/customers" });
fastify.register(product_routes_1.productRoutes, { prefix: "/api/products" });
fastify.register(order_routes_1.orderRoutes, { prefix: "/api/orders" });
fastify.register(category_routes_1.categoryRoutes, { prefix: "/api/categories" });
fastify.register(provider_routes_1.providerRoutes, { prefix: "/api/providers" });
fastify.register(inventory_routes_1.inventoryRoutes, { prefix: "/api/inventory" });
fastify.register(expense_routes_1.expenseRoutes, { prefix: "/api/expenses" });
const start = async () => {
    try {
        await fastify.listen({ port: 3001 });
        console.log("Server is running on port 3001");
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
