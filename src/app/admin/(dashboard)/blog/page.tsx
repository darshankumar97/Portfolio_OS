import type { Metadata } from "next";
import { listBlogPostsAdmin } from "@/lib/admin/queries";
import { BlogClient } from "@/components/admin/blog/BlogClient";

export const metadata: Metadata = {
  title: "Blog — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const items = await listBlogPostsAdmin();
  return <BlogClient initialItems={items} />;
}
