import type { Metadata } from "next";
import { listTestimonialsAdmin } from "@/lib/admin/queries";
import { TestimonialsClient } from "@/components/admin/testimonials/TestimonialsClient";

export const metadata: Metadata = {
  title: "Testimonials — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const items = await listTestimonialsAdmin();
  return <TestimonialsClient initialItems={items} />;
}
