import "server-only";
import { createClient } from "@supabase/supabase-js";

// supabase-js always constructs a Realtime client, which requires a global
// WebSocket (native only from Node 22+). This app only uses Storage, so
// polyfill just enough to satisfy that constructor on Node 20.
if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = require("ws");
}

// Service-role client — full storage access, never expose to the browser.
// Only import this from server actions / route handlers / server components.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export const MEDIA_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "devos-media";

export function publicMediaUrl(path: string): string {
  return supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
