import Link from "next/link";
import { getSiteConfig, getProfile, getSocialLinks } from "@/lib/content";

export function Footer() {
  const site = getSiteConfig();
  const profile = getProfile();
  const social = getSocialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="section-padding container-wide py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{site.name}</p>
            <p className="mt-1 max-w-xs text-sm text-muted">{site.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {social.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.icon === "email" ? undefined : "_blank"}
                rel={link.icon === "email" ? undefined : "noopener noreferrer"}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-light">
            © {year} {profile.name}. All rights reserved.
          </p>
          <Link
            href={site.url}
            className="text-xs text-muted-light transition-colors hover:text-muted"
          >
            {site.domain}
          </Link>
        </div>
      </div>
    </footer>
  );
}
