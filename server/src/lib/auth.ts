import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";


import prisma from "./db/dbConnect.js";

const rawTrustedOrigins = [
    process.env.BETTER_AUTH_URL,
    process.env.FRONTEND_URL,
    'https://vantish.online',
    'https://www.vantish.online',
    'http://localhost:5173',
    'http://localhost:3000',
].filter(Boolean) as string[];

const trustedOrigins = Array.from(new Set(rawTrustedOrigins.map(u => u.replace(/\/$/, ''))));

export const auth = betterAuth({
    baseURL: (process.env.BETTER_AUTH_URL || 'http://localhost:3000').replace(/\/$/, ''),
    trustedOrigins,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
});