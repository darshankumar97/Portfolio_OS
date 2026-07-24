import type { Metadata } from "next";
import { listMediaAdmin } from "@/lib/admin/actions/media";
import { MediaLibraryClient } from "@/components/admin/media/MediaLibraryClient";

export const metadata: Metadata = {
  title: "Media library — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function MediaPage() {
  const assets = await listMediaAdmin();
  return <MediaLibraryClient initialAssets={assets} />;
}
