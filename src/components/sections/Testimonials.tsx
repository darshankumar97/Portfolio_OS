import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { getTestimonials } from "@/lib/content";

export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading label="Testimonials" title="What people say" />
        </FadeIn>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {testimonials.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.06} className="mb-5 break-inside-avoid">
              <Card>
                <p className="text-sm leading-relaxed text-muted">“{item.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  {item.avatarUrl ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <Image src={item.avatarUrl} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border-subtle text-sm font-medium text-muted">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-light">
                      {item.role}
                      {item.company ? ` · ${item.company}` : ""}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
