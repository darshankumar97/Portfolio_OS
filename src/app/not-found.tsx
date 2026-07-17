import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="section-padding container-narrow flex min-h-[60vh] flex-col items-start justify-center pt-28 pb-20">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="mt-6">
        <Button href="/">Back home</Button>
      </div>
    </div>
  );
}
