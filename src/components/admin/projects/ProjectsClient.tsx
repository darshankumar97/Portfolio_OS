"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DndListContainer } from "@/components/admin/DndListContainer";
import { SortableRow } from "@/components/admin/SortableRow";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { RowActions } from "@/components/admin/RowActions";
import { Drawer } from "@/components/admin/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import {
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublished,
  reorderProjects,
} from "@/lib/admin/actions/projects";
import type { Project } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { ProjectFormValues } from "@/lib/admin/schemas";

type ProjectRow = Project & AdminRow;

const BLANK: ProjectFormValues = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  problem: "",
  solution: "",
  impact: [],
  technologies: [],
  category: "product",
  status: "in-progress",
  featured: false,
  published: true,
  links: {},
  metrics: [],
  gallery: [],
  coverImage: "",
};

export function ProjectsClient({ initialProjects }: { initialProjects: ProjectRow[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<ProjectRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds
      .map((id) => projects.find((p) => p.id === id))
      .filter((p): p is ProjectRow => Boolean(p));
    setProjects(reordered);
    const result = await reorderProjects(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(project: ProjectRow) {
    const next = !project.published;
    setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, published: next } : p)));
    const result = await toggleProjectPublished(project.id, next);
    if (!result.ok) {
      setError(result.error);
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = projects;
    setProjects((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteProject(id);
    if (!result.ok) {
      setError(result.error);
      setProjects(prev);
    }
  }

  async function handleSubmit(values: ProjectFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createProject(values);
      if (!result.ok) return result.error;
      setProjects((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateProject(editing.id, values);
      if (!result.ok) return result.error;
      setProjects((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: ProjectFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            slug: editing.slug,
            title: editing.title,
            tagline: editing.tagline,
            description: editing.description,
            problem: editing.problem,
            solution: editing.solution,
            impact: editing.impact,
            technologies: editing.technologies,
            category: editing.category,
            status: editing.status,
            featured: editing.featured,
            published: editing.published,
            links: editing.links,
            metrics: editing.metrics ?? [],
            gallery: editing.gallery ?? [],
            coverImage: editing.coverImage ?? "",
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Case studies shown in Finder and on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add project</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {projects.length === 0 ? (
        <EmptyState message="No projects yet — add your first one." />
      ) : (
        <DndListContainer ids={projects.map((p) => p.id)} onReorder={handleReorder}>
          {projects.map((project) => (
            <SortableRow key={project.id} id={project.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{project.title}</p>
                    <Badge variant="muted">{project.category}</Badge>
                    {project.featured && <Badge variant="accent">Featured</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-light">{project.tagline}</p>
                </div>
                <PublishSwitch published={project.published} onChange={() => handleTogglePublished(project)} />
                <RowActions onEdit={() => setEditing(project)} onDelete={() => handleDelete(project.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add project" : "Edit project"}
      >
        {drawerDefaults && (
          <ProjectForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add project" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
