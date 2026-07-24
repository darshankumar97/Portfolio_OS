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
import { ExperienceForm } from "@/components/admin/experience/ExperienceForm";
import {
  createExperience,
  updateExperience,
  deleteExperience,
  toggleExperiencePublished,
  reorderExperience,
} from "@/lib/admin/actions/experience";
import type { Experience } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { ExperienceFormValues } from "@/lib/admin/schemas";

type ExperienceRow = Experience & AdminRow;

const BLANK: ExperienceFormValues = {
  company: "",
  role: "",
  period: "",
  location: "",
  type: "full-time",
  description: "",
  achievements: [],
  technologies: [],
  featured: false,
  published: true,
};

export function ExperienceClient({ initialItems }: { initialItems: ExperienceRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<ExperienceRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is ExperienceRow => Boolean(p));
    setItems(reordered);
    const result = await reorderExperience(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: ExperienceRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleExperiencePublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteExperience(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: ExperienceFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createExperience(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateExperience(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: ExperienceFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            company: editing.company,
            role: editing.role,
            period: editing.period,
            location: editing.location,
            type: editing.type,
            description: editing.description,
            achievements: editing.achievements,
            technologies: editing.technologies,
            featured: editing.featured,
            published: editing.published,
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        description="Work history shown in Preview and on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add role</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No experience entries yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.role} <span className="font-normal text-muted">· {item.company}</span>
                    </p>
                    {item.featured && <Badge variant="accent">Featured</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-light">{item.period}</p>
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add role" : "Edit role"}>
        {drawerDefaults && (
          <ExperienceForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add role" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
