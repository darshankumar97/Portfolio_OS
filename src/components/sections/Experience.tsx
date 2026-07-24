import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { getFeaturedExperience } from "@/lib/content";

export async function Experience() {
  const experience = await getFeaturedExperience();

  return (
    <section id="experience" className="section-padding">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading
            label="Experience"
            title="Where I've built and shipped"
            description="Roles focused on ownership, system quality, and delivering measurable outcomes."
          />
        </FadeIn>

        <div className="space-y-0 divide-y divide-border">
          {experience.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.06}>
              <article className="grid gap-4 py-8 sm:grid-cols-[200px_1fr] sm:gap-8">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.period}</p>
                  <p className="mt-1 text-sm text-muted">{item.location}</p>
                  <Badge variant="muted" className="mt-3">
                    {item.type}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.role}
                    <span className="font-normal text-muted"> · {item.company}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {item.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="flex gap-2 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
