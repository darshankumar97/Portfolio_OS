import type { Metadata } from "next";
import { listResearchAdmin } from "@/lib/admin/queries";
import { ResearchClient } from "@/components/admin/research/ResearchClient";

export const metadata: Metadata = {
  title: "Research — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminResearchPage() {
  const items = await listResearchAdmin();
  return <ResearchClient initialItems={items} />;
}
