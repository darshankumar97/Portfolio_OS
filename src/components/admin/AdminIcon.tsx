export type AdminIconName =
  | "dashboard"
  | "profile"
  | "projects"
  | "experience"
  | "research"
  | "skills"
  | "services"
  | "education"
  | "certifications"
  | "achievements"
  | "testimonials"
  | "blog"
  | "navigation"
  | "social"
  | "media"
  | "appearance"
  | "settings"
  | "external"
  | "logout"
  | "eye";

const PATHS: Record<AdminIconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6" />
    </>
  ),
  projects: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  research: (
    <>
      <path d="M9 2v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-11V2" />
      <path d="M9 2h6" />
    </>
  ),
  skills: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  services: (
    <>
      <path d="M12 2l3 5 5.5.8-4 3.9.9 5.5-4.9-2.6L7.6 17.2l.9-5.5-4-3.9L10 7z" />
    </>
  ),
  education: (
    <>
      <path d="M2 9.5 12 4l10 5.5-10 5.5-10-5.5z" />
      <path d="M6 12v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" />
    </>
  ),
  certifications: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
    </>
  ),
  achievements: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5 7 21l5-2.5 5 2.5-1.5-8.5" />
    </>
  ),
  testimonials: (
    <>
      <path d="M7 8h4v4c0 2.2-1.8 4-4 4v-2.2c1 0 1.6-.6 1.8-1.8H7z" />
      <path d="M14 8h4v4c0 2.2-1.8 4-4 4v-2.2c1 0 1.6-.6 1.8-1.8H14z" />
    </>
  ),
  blog: (
    <>
      <path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  navigation: (
    <>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </>
  ),
  social: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.3 10.8 15.7 7.2M8.3 13.2l7.4 3.6" />
    </>
  ),
  media: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5L4 21" />
    </>
  ),
  appearance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 1-2.2-.8-.9-.2-2.3 1-2.3H16a4 4 0 0 0 4-4c0-5-3.6-9.5-8-9.5z" />
      <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

interface AdminIconProps {
  name: AdminIconName;
  className?: string;
}

export function AdminIcon({ name, className }: AdminIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
