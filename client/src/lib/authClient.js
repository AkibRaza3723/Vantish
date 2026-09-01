import { createAuthClient } from "better-auth/react";

const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL: apiBase,
});

export const { signIn, signUp, signOut, useSession } = authClient;