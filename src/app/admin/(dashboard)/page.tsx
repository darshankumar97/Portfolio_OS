import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";

export const metadata: Metadata = {
  title: "Dashboard — DevOS Admin",
  robots: { index: false, follow: false },
};

async function getCounts() {
  const [
    projects,
    publishedProjects,
    experience,
    research,
    skills,
    services,
    education,
    certifications,
    achievements,
    testimonials,
    blog,
    media,
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { published: true } }),
    db.experience.count(),
    db.research.count(),
    db.skillCategory.count(),
    db.service.count(),
    db.education.count(),
    db.certification.count(),
    db.achievement.count(),
    db.testimonial.count(),
    db.blogPost.count(),
    db.mediaAsset.count(),
  ]);
  return {
    projects,
    publishedProjects,
    experience,
    research,
    skills,
    services,
    education,
    certifications,
    achievements,
    testimonials,
    blog,
    media,
  };
}

const CARDS: { key: keyof Awaited<ReturnType<typeof getCounts>>; label: string; href: string; icon: AdminIconName }[] = [
  { key: "projects", label: "Projects", href: "/admin/projects", icon: "projects" },
  { key: "experience", label: "Experience entries", href: "/admin/experience", icon: "experience" },
  { key: "research", label: "Research entries", href: "/admin/research", icon: "research" },
  { key: "skills", label: "Skill categories", href: "/admin/skills", icon: "skills" },
  { key: "services", label: "Services", href: "/admin/services", icon: "services" },
  { key: "education", label: "Education entries", href: "/admin/education", icon: "education" },
  { key: "certifications", label: "Certifications", href: "/admin/certifications", icon: "certifications" },
  { key: "achievements", label: "Achievements", href: "/admin/achievements", icon: "achievements" },
  { key: "testimonials", label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
  { key: "blog", label: "Blog posts", href: "/admin/blog", icon: "blog" },
  { key: "media", label: "Media assets", href: "/admin/media", icon: "media" },
];

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        {counts.publishedProjects} of {counts.projects} projects are live on the site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-elevated p-5 transition-colors hover:border-muted-light/40 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
              <AdminIcon name={card.icon} className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{counts[card.key]}</p>
              <p className="text-sm text-muted">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-border bg-surface-elevated p-5">
        <p className="text-sm font-medium text-foreground">Quick tips</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          <li>
            • Use <span className="font-medium text-foreground">Preview site</span> (top right) to
            see draft content before publishing it.
          </li>
          <li>• Reorder any list by dragging rows — the public site updates immediately.</li>
          <li>• Upload images once in the Media Library, then reuse them anywhere.</li>
        </ul>
      </div>
    </div>
  );
}
