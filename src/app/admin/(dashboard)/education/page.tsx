import type { Metadata } from "next";
import { listEducationAdmin } from "@/lib/admin/queries";
import { EducationClient } from "@/components/admin/education/EducationClient";

export const metadata: Metadata = {
  title: "Education — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminEducationPage() {
  const items = await listEducationAdmin();
  return <EducationClient initialItems={items} />;
}
