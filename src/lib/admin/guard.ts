import "server-only";
import { getAdminSession } from "@/lib/auth/current-user";

/** Defense-in-depth for server actions: middleware already gates /admin/**, this re-checks inside the action itself. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
