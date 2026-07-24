import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { getProfile } from "@/lib/content";

export async function About() {
  const profile = await getProfile();

  return (
    <section id="about" className="section-padding border-t border-border bg-surface-elevated">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading
            label="About"
            title={`Engineering with intent`}
            description={profile.bio}
          />
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-3">
          {profile.audiences.map((audience, i) => (
            <FadeIn key={audience.id} delay={i * 0.08}>
              <Card hover className="h-full">
                <h3 className="text-sm font-semibold text-foreground">
                  {audience.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {audience.description}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
