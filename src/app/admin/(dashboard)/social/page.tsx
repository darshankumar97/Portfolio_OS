import type { Metadata } from "next";
import { listSocialAdmin } from "@/lib/admin/queries";
import { SocialClient } from "@/components/admin/social/SocialClient";

export const metadata: Metadata = {
  title: "Social links — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSocialPage() {
  const items = await listSocialAdmin();
  return <SocialClient initialItems={items} />;
}
