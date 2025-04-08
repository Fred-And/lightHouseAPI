import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service";
import { FastifyCookieOptions } from "@fastify/cookie";

interface LoginBody {
  username: string;
  password: string;
}

interface RegisterBody extends LoginBody {
  confirmPassword: string;
}

type CookieReply = FastifyReply & {
  setCookie: (
    name: string,
    value: string,
    options?: FastifyCookieOptions
  ) => FastifyReply;
  clearCookie: (name: string) => FastifyReply;
};

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();

  fastify.get(
    "/check",
    async (request: FastifyRequest, reply: FastifyReply) => {
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
      } catch (error) {
        return { authenticated: false };
      }
    }
  );

  fastify.post(
    "/login",
    async (
      request: FastifyRequest<{ Body: LoginBody }>,
      reply: CookieReply
    ) => {
      try {
        const result = await authService.login(request.body, reply);
        return result;
      } catch (error: any) {
        reply.status(401).send({ error: error.message });
      }
    }
  );

  fastify.post(
    "/register",
    async (
      request: FastifyRequest<{ Body: RegisterBody }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await authService.register(request.body);
        return result;
      } catch (error: any) {
        reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.post(
    "/logout",
    async (request: FastifyRequest, reply: CookieReply) => {
      try {
        const result = await authService.logout(reply);
        return result;
      } catch (error: any) {
        reply.status(500).send({ error: error.message });
      }
    }
  );
}
