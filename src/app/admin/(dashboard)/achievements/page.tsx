import type { Metadata } from "next";
import { listAchievementsAdmin } from "@/lib/admin/queries";
import { AchievementsClient } from "@/components/admin/achievements/AchievementsClient";

export const metadata: Metadata = {
  title: "Achievements — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAchievementsPage() {
  const items = await listAchievementsAdmin();
  return <AchievementsClient initialItems={items} />;
}
