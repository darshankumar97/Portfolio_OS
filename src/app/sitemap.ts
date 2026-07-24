import type { MetadataRoute } from "next";
import { getSiteConfig, getProjects, getBlogPosts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, projects, posts] = await Promise.all([getSiteConfig(), getProjects(), getBlogPosts()]);

  const projectUrls = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogUrls = posts
    .filter((post) => !post.externalUrl)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectUrls,
    ...blogUrls,
  ];
}
