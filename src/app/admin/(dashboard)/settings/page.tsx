import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { SiteSettingsFormValues } from "@/lib/admin/schemas";

export const metadata: Metadata = {
  title: "Site settings — DevOS Admin",
  robots: { index: false, follow: false },
};

const BLANK: SiteSettingsFormValues = {
  name: "",
  tagline: "",
  domain: "",
  url: "",
  description: "",
  keywords: [],
  locale: "en_US",
  resumeUrl: "",
  ogImageUrl: "",
};

export default async function AdminSettingsPage() {
  const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  const defaultValues: SiteSettingsFormValues = row
    ? {
        name: row.name,
        tagline: row.tagline,
        domain: row.domain,
        url: row.url,
        description: row.description,
        keywords: row.keywords as unknown as string[],
        locale: row.locale,
        resumeUrl: row.resumeUrl ?? "",
        ogImageUrl: row.ogImageUrl ?? "",
      }
    : BLANK;

  return (
    <div>
      <AdminPageHeader title="Site settings & SEO" description="Global metadata used across the site." />
      <SiteSettingsForm defaultValues={defaultValues} />
    </div>
  );
}
