import type { Metadata } from "next";
import { listWallpapersAdmin, listAccentsAdmin } from "@/lib/admin/queries";
import { AppearanceClient } from "@/components/admin/appearance/AppearanceClient";

export const metadata: Metadata = {
  title: "Appearance — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAppearancePage() {
  const [wallpapers, accents] = await Promise.all([listWallpapersAdmin(), listAccentsAdmin()]);
  return <AppearanceClient initialWallpapers={wallpapers} initialAccents={accents} />;
}
