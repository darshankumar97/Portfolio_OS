import type { Metadata } from "next";
import { listCertificationsAdmin } from "@/lib/admin/queries";
import { CertificationsClient } from "@/components/admin/certifications/CertificationsClient";

export const metadata: Metadata = {
  title: "Certifications — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCertificationsPage() {
  const items = await listCertificationsAdmin();
  return <CertificationsClient initialItems={items} />;
}
