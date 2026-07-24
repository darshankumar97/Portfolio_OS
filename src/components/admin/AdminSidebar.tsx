"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: AdminIconName;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }],
  },
  {
    label: "Content",
    items: [
      { label: "Profile", href: "/admin/profile", icon: "profile" },
      { label: "Projects", href: "/admin/projects", icon: "projects" },
      { label: "Experience", href: "/admin/experience", icon: "experience" },
      { label: "Research", href: "/admin/research", icon: "research" },
      { label: "Skills", href: "/admin/skills", icon: "skills" },
      { label: "Services", href: "/admin/services", icon: "services" },
      { label: "Education", href: "/admin/education", icon: "education" },
      { label: "Certifications", href: "/admin/certifications", icon: "certifications" },
      { label: "Achievements", href: "/admin/achievements", icon: "achievements" },
      { label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
      { label: "Blog", href: "/admin/blog", icon: "blog" },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Navigation", href: "/admin/navigation", icon: "navigation" },
      { label: "Social links", href: "/admin/social", icon: "social" },
      { label: "Media library", href: "/admin/media", icon: "media" },
      { label: "Appearance", href: "/admin/appearance", icon: "appearance" },
      { label: "Site settings & SEO", href: "/admin/settings", icon: "settings" },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface-elevated px-3 py-5">
      <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-surface">
          D
        </span>
        <span className="text-sm font-semibold text-foreground">DevOS Admin</span>
      </Link>

      <div className="flex-1 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[11px] font-semibold tracking-wide text-muted-light uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent-subtle text-accent"
                        : "text-muted hover:bg-border-subtle hover:text-foreground"
                    )}
                  >
                    <AdminIcon name={item.icon} className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
