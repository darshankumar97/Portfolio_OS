import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { getProfile, getSocialLinks } from "@/lib/content";

export async function Contact() {
  const [profile, social] = await Promise.all([getProfile(), getSocialLinks()]);

  return (
    <section id="contact" className="section-padding border-t border-border bg-surface-elevated">
      <div className="container-narrow py-20 sm:py-28">
        <FadeIn>
          <div className="rounded-2xl border border-border bg-surface p-8 sm:p-12">
            <p className="text-sm font-medium tracking-wide text-accent uppercase">
              Contact
            </p>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Let&apos;s build something that matters
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              {profile.availability}. Reach out for roles, collaborations, or project inquiries.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`mailto:${profile.email}`} external>
                {profile.email}
              </Button>
              {social
                .filter((s) => s.icon !== "email")
                .map((link) => (
                  <Button key={link.id} href={link.url} variant="secondary" external>
                    {link.label}
                  </Button>
                ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
