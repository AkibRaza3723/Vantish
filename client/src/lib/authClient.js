import { createAuthClient } from "better-auth/react";

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL 
const baseURL = rawBackendUrl.replace(/\/+$/, "");

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;