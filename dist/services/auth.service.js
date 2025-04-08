"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
class AuthService {
    async register(data) {
        if (data.password !== data.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { username: data.username },
        });
        if (existingUser) {
            throw new Error("Username already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
            },
        });
        return { message: "User registered successfully", userId: user.id };
    }
    async login(credentials, reply) {
        const user = await prisma_1.default.user.findUnique({
            where: { username: credentials.username },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isValidPassword = await bcrypt_1.default.compare(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        reply.setCookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
        });
        return { message: "Login successful", userId: user.id };
    }
    async logout(reply) {
        reply.clearCookie("token");
        return { message: "Logout successful" };
    }
    async checkAuth(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = await prisma_1.default.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, username: true },
            });
            return user;
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
