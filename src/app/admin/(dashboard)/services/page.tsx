import type { Metadata } from "next";
import { listServicesAdmin } from "@/lib/admin/queries";
import { ServicesClient } from "@/components/admin/services/ServicesClient";

export const metadata: Metadata = {
  title: "Services — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const items = await listServicesAdmin();
  return <ServicesClient initialItems={items} />;
}
