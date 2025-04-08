import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.cookies.token;

    if (!token) {
      reply.status(401).send({ error: "Authentication required" });
      return;
    }

    const user = await authService.checkAuth(token);
    if (!user) {
      reply.status(401).send({ error: "Invalid or expired token" });
      return;
    }

    request.user = user;
  } catch (error) {
    reply.status(401).send({ error: "Authentication failed" });
    return;
  }
}
