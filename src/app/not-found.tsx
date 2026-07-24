import Link from "next/link";

// Fallback for routes outside the (site) group (e.g. unmatched /admin/* paths).
// The public-facing 404 with full Header/Footer chrome lives at (site)/not-found.tsx.
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <Link href="/" className="text-sm text-muted underline-offset-4 hover:underline">
        Back home
      </Link>
    </div>
  );
}
