import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { getAchievements } from "@/lib/content";

export async function Achievements() {
  const achievements = await getAchievements();
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="section-padding">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading label="Achievements" title="Recognitions" />
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.06}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  {item.date && <span className="shrink-0 text-xs text-muted-light">{item.date}</span>}
                </div>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                )}
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
