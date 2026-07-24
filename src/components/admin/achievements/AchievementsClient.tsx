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
import { AchievementForm } from "@/components/admin/achievements/AchievementForm";
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleAchievementPublished,
  reorderAchievements,
} from "@/lib/admin/actions/achievements";
import type { Achievement } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { AchievementFormValues } from "@/lib/admin/schemas";

type AchievementRow = Achievement & AdminRow;

const BLANK: AchievementFormValues = { title: "", description: "", date: "", published: true };

export function AchievementsClient({ initialItems }: { initialItems: AchievementRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<AchievementRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is AchievementRow => Boolean(p));
    setItems(reordered);
    const result = await reorderAchievements(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: AchievementRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleAchievementPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteAchievement(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: AchievementFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createAchievement(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateAchievement(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: AchievementFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            title: editing.title,
            description: editing.description ?? "",
            date: editing.date ?? "",
            published: editing.published,
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Achievements"
        description="Awards and recognitions shown on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add achievement</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No achievements yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  {item.date && <p className="truncate text-xs text-muted-light">{item.date}</p>}
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add achievement" : "Edit achievement"}
      >
        {drawerDefaults && (
          <AchievementForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add achievement" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
