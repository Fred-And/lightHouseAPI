import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { authRoutes } from "./routes/auth.routes";

const app = fastify({
  logger: true,
});

// Register cookie plugin first with proper configuration
app.register(cookie, {
  secret: process.env.COOKIE_SECRET || "your-secret-key",
  hook: "onRequest",
  parseOptions: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  },
});

// Then register CORS with proper configuration for cookies
app.register(cors, {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
});

// Finally register routes
app.register(authRoutes, { prefix: "/api/auth" });

export default app;
