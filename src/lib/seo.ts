import type { Metadata } from "next";
import { getSiteConfig, getProfile } from "./content";

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
  const site = getSiteConfig();
  const profile = getProfile();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${profile.name} — ${profile.title}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: profile.name, url: site.url }],
    creator: profile.name,
    openGraph: {
      type: "website",
      locale: site.locale,
      url: site.url,
      siteName: site.name,
      title: `${profile.name} — ${profile.title}`,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} — ${profile.title}`,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: site.url,
    },
    ...overrides,
  };
}
