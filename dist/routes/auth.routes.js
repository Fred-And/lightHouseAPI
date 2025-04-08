"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_service_1 = require("../services/auth.service");
async function authRoutes(fastify) {
    const authService = new auth_service_1.AuthService();
    fastify.get("/check", async (request, reply) => {
        try {
            const token = request.cookies.token;
            if (!token) {
                return { authenticated: false };
            }
            const user = await authService.checkAuth(token);
            if (!user) {
                return { authenticated: false };
            }
            return { authenticated: true, user };
        }
        catch (error) {
            return { authenticated: false };
        }
    });
    fastify.post("/register", async (request, reply) => {
        try {
            const result = await authService.register(request.body);
            return result;
        }
        catch (error) {
            reply.status(400).send({ error: error.message });
        }
    });
    fastify.post("/login", async (request, reply) => {
        try {
            const result = await authService.login(request.body, reply);
            return result;
        }
        catch (error) {
            reply.status(401).send({ error: error.message });
        }
    });
    fastify.post("/logout", async (request, reply) => {
        try {
            const result = await authService.logout(reply);
            return result;
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to logout" });
        }
    });
}
