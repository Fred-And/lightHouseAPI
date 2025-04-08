import { FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { FastifyCookieOptions } from "@fastify/cookie";

const prisma = new PrismaClient();

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
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

export class AuthService {
  async register(data: RegisterData) {
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
      },
    });

    return { message: "User registered successfully", userId: user.id };
  }

  async login(
    { username, password }: { username: string; password: string },
    reply: CookieReply
  ) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Set cookie using the cookie plugin
    reply.setCookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { message: "Login successful" };
  }

  async logout(reply: CookieReply) {
    reply.clearCookie("token");
    return { message: "Logged out successfully" };
  }

  async checkAuth(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { userId: number; username: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
        },
      });

      return user;
    } catch (error) {
      return null;
    }
  }
}
