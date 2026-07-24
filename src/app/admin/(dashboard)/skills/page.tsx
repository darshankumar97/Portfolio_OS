import type { Metadata } from "next";
import { listSkillsAdmin } from "@/lib/admin/queries";
import { SkillsClient } from "@/components/admin/skills/SkillsClient";

export const metadata: Metadata = {
  title: "Skills — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  const items = await listSkillsAdmin();
  return <SkillsClient initialItems={items} />;
}
