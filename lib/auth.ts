import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "authenticated";

export const createSession = async () => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const isAuthenticated = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
};

export const clearSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
};

export const isAuthenticatedRequest = (cookieValue?: string) => {
  return cookieValue === SESSION_VALUE;
};
