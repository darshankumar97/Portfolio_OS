import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFeaturedProjects } from "@/lib/content";

export function Projects() {
  const projects = getFeaturedProjects();

  return (
    <section id="work" className="section-padding border-t border-border bg-surface-elevated">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading
            label="Work"
            title="Selected projects"
            description="Product builds, systems work, and engineering initiatives — focused on impact and craft."
          />
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.08}>
              <Link href={`/projects/${project.slug}`} className="group block h-full">
                <Card hover className="flex h-full flex-col">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{project.tagline}</p>
                    </div>
                    <Badge variant="accent">{project.category}</Badge>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  {project.metrics && project.metrics.length > 0 && (
                    <div className="mt-5 flex gap-6 border-t border-border-subtle pt-5">
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p className="text-lg font-semibold text-foreground">
                            {metric.value}
                          </p>
                          <p className="text-xs text-muted-light">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="muted">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
