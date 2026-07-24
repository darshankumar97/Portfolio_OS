import type { Metadata } from "next";
import { listExperienceAdmin } from "@/lib/admin/queries";
import { ExperienceClient } from "@/components/admin/experience/ExperienceClient";

export const metadata: Metadata = {
  title: "Experience — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminExperiencePage() {
  const items = await listExperienceAdmin();
  return <ExperienceClient initialItems={items} />;
}
