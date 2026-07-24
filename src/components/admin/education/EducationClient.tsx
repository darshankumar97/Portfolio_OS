"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DndListContainer } from "@/components/admin/DndListContainer";
import { SortableRow } from "@/components/admin/SortableRow";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { RowActions } from "@/components/admin/RowActions";
import { Drawer } from "@/components/admin/Drawer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { EducationForm } from "@/components/admin/education/EducationForm";
import {
  createEducation,
  updateEducation,
  deleteEducation,
  toggleEducationPublished,
  reorderEducation,
} from "@/lib/admin/actions/education";
import type { Education } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { EducationFormValues } from "@/lib/admin/schemas";

type EducationRow = Education & AdminRow;

const BLANK: EducationFormValues = {
  institution: "",
  degree: "",
  field: "",
  period: "",
  location: "",
  description: "",
  published: true,
};

export function EducationClient({ initialItems }: { initialItems: EducationRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<EducationRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is EducationRow => Boolean(p));
    setItems(reordered);
    const result = await reorderEducation(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: EducationRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleEducationPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteEducation(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: EducationFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createEducation(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateEducation(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: EducationFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            institution: editing.institution,
            degree: editing.degree,
            field: editing.field ?? "",
            period: editing.period,
            location: editing.location ?? "",
            description: editing.description ?? "",
            published: editing.published,
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Education"
        description="Degrees and academic background shown on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add education</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No education entries yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.institution}</p>
                  <p className="truncate text-xs text-muted-light">
                    {item.degree}
                    {item.field ? ` · ${item.field}` : ""} · {item.period}
                  </p>
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add education" : "Edit education"}>
        {drawerDefaults && (
          <EducationForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add education" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
