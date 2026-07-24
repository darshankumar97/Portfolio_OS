import type { Metadata } from "next";
import { listNavigationAdmin } from "@/lib/admin/queries";
import { NavigationClient } from "@/components/admin/navigation/NavigationClient";

export const metadata: Metadata = {
  title: "Navigation — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminNavigationPage() {
  const items = await listNavigationAdmin();
  return <NavigationClient initialItems={items} />;
}
