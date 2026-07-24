import { draftMode } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getProfile, getSiteConfig, getNavigation } from "@/lib/content";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, site, nav, dm] = await Promise.all([
    getProfile(),
    getSiteConfig(),
    getNavigation(),
    draftMode(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: site.url,
    email: profile.email,
    description: profile.bio,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {dm.isEnabled && (
        <div className="fixed inset-x-0 top-0 z-[10000] flex items-center justify-center gap-2 bg-accent px-4 py-1.5 text-xs font-medium text-white">
          Previewing draft content — visitors won&apos;t see this
        </div>
      )}
      <Header site={site} nav={nav} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
