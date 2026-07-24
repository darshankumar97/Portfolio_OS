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
import { SkillCategoryForm } from "@/components/admin/skills/SkillCategoryForm";
import {
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  toggleSkillCategoryPublished,
  reorderSkillCategories,
} from "@/lib/admin/actions/skills";
import type { SkillCategory } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { SkillCategoryFormValues } from "@/lib/admin/schemas";

type SkillCategoryRow = SkillCategory & AdminRow;

const BLANK: SkillCategoryFormValues = { name: "", skills: [], published: true };

export function SkillsClient({ initialItems }: { initialItems: SkillCategoryRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<SkillCategoryRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is SkillCategoryRow => Boolean(p));
    setItems(reordered);
    const result = await reorderSkillCategories(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: SkillCategoryRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleSkillCategoryPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteSkillCategory(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: SkillCategoryFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createSkillCategory(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateSkillCategory(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: SkillCategoryFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? { name: editing.name, skills: editing.skills, published: editing.published }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Technical capability categories shown on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add category</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No skill categories yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.skills.slice(0, 6).map((s) => (
                      <Badge key={s.name} variant="muted">
                        {s.name}
                      </Badge>
                    ))}
                    {item.skills.length > 6 && <Badge variant="muted">+{item.skills.length - 6}</Badge>}
                  </div>
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add category" : "Edit category"}>
        {drawerDefaults && (
          <SkillCategoryForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add category" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
