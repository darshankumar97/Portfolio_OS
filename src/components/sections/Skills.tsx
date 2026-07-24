import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { getSkills } from "@/lib/content";

export async function Skills() {
  const categories = await getSkills();

  return (
    <section id="skills" className="section-padding border-t border-border bg-surface-elevated">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading
            label="Capabilities"
            title="Technical stack"
            description="Tools and technologies I use to design, build, and operate production systems."
          />
        </FadeIn>

        <div className="grid gap-8 sm:grid-cols-2">
          {categories.map((category, i) => (
            <FadeIn key={category.id} delay={i * 0.06}>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant={skill.level === "expert" ? "accent" : "default"}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
