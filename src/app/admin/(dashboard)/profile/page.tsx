import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/admin/profile/ProfileForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { ProfileFormValues } from "@/lib/admin/schemas";

export const metadata: Metadata = {
  title: "Profile — DevOS Admin",
  robots: { index: false, follow: false },
};

const BLANK: ProfileFormValues = {
  name: "",
  title: "",
  headline: "",
  subheadline: "",
  location: "",
  email: "",
  availability: "",
  bio: "",
  avatarUrl: "",
  highlights: [],
  audiences: [],
};

export default async function AdminProfilePage() {
  const row = await db.profile.findUnique({ where: { id: "singleton" } });
  const defaultValues: ProfileFormValues = row
    ? {
        name: row.name,
        title: row.title,
        headline: row.headline,
        subheadline: row.subheadline,
        location: row.location,
        email: row.email,
        availability: row.availability,
        bio: row.bio,
        avatarUrl: row.avatarUrl ?? "",
        highlights: row.highlights as unknown as ProfileFormValues["highlights"],
        audiences: row.audiences as unknown as ProfileFormValues["audiences"],
      }
    : BLANK;

  return (
    <div>
      <AdminPageHeader title="Profile" description="Your identity across the whole site." />
      <ProfileForm defaultValues={defaultValues} />
    </div>
  );
}
