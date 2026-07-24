import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEducation } from "@/lib/content";

export async function Education() {
  const education = await getEducation();
  if (education.length === 0) return null;

  return (
    <section id="education" className="section-padding">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading label="Education" title="Academic background" />
        </FadeIn>

        <div className="space-y-0 divide-y divide-border">
          {education.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.06}>
              <article className="grid gap-4 py-8 sm:grid-cols-[200px_1fr] sm:gap-8">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.period}</p>
                  {item.location && <p className="mt-1 text-sm text-muted">{item.location}</p>}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.degree}
                    {item.field && <span className="font-normal text-muted"> in {item.field}</span>}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.institution}</p>
                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                  )}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
