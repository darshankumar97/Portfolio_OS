import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFeaturedResearch } from "@/lib/content";

export async function Research() {
  const research = await getFeaturedResearch();

  return (
    <section id="research" className="section-padding">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading
            label="Research"
            title="Engineering depth & inquiry"
            description="Work at the intersection of systems thinking, experimentation, and practical implementation."
          />
        </FadeIn>

        <div className="grid gap-5">
          {research.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.08}>
              <Card hover>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {item.authors.join(", ")} · {item.venue}, {item.year}
                    </p>
                  </div>
                  <Badge variant="muted">{item.type}</Badge>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{item.abstract}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
