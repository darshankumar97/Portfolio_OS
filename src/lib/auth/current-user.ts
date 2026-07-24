import "server-only";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE, type SessionPayload } from "./session";

export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
