import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createMetadata } from "@/lib/seo";
import { getProjects, getProjectBySlug } from "@/lib/content";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return createMetadata();

  return createMetadata({
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | DevOS`,
      description: project.description,
    },
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="section-padding container-narrow pt-28 pb-20 sm:pt-36 sm:pb-28">
      <FadeIn>
        <Link
          href="/#work"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Back to work
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{project.category}</Badge>
          <Badge variant="muted">{project.status}</Badge>
        </div>

        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{project.tagline}</p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10 space-y-10">
        <section>
          <h2 className="text-sm font-semibold text-foreground">Overview</h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {project.description}
          </p>
        </section>

        <section className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Problem</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.problem}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Solution</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.solution}</p>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground">Impact</h2>
          <ul className="mt-4 space-y-2">
            {project.impact.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {project.metrics && project.metrics.length > 0 && (
          <section className="flex flex-wrap gap-8 rounded-xl border border-border bg-surface-elevated p-6">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-light">{metric.label}</p>
              </div>
            ))}
          </section>
        )}

        <section>
          <h2 className="text-sm font-semibold text-foreground">Technologies</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </section>

        {(project.links.live || project.links.github || project.links.paper || project.links.demo) && (
          <section className="flex flex-wrap gap-3 pt-4">
            {project.links.live && (
              <Button href={project.links.live} external>
                View live
              </Button>
            )}
            {project.links.github && (
              <Button href={project.links.github} variant="secondary" external>
                GitHub
              </Button>
            )}
            {project.links.demo && (
              <Button href={project.links.demo} variant="secondary" external>
                Demo
              </Button>
            )}
            {project.links.paper && (
              <Button href={project.links.paper} variant="secondary" external>
                Paper
              </Button>
            )}
          </section>
        )}
      </FadeIn>
    </article>
  );
}
