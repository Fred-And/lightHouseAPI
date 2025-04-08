"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const auth_routes_1 = require("./routes/auth.routes");
const app = (0, fastify_1.default)();
app.register(cors_1.default, {
    origin: process.env.CLIENT_URL || "http://localhost:4000",
    credentials: true,
});
app.register(cookie_1.default);
app.register(auth_routes_1.authRoutes, { prefix: "/api/auth" });
exports.default = app;
