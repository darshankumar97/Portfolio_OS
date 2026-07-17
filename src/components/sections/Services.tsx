import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { getServices } from "@/lib/content";

export function Services() {
  const services = getServices();

  return (
    <section id="services" className="section-padding">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading
            label="Services"
            title="How I can help"
            description="Scoped engagements for founders and teams who need reliable engineering delivery."
          />
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-3">
          {services.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.08}>
              <Card hover className="h-full">
                <h3 className="text-base font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-border-subtle pt-5">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
