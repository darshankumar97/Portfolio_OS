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
import { ResearchForm } from "@/components/admin/research/ResearchForm";
import {
  createResearch,
  updateResearch,
  deleteResearch,
  toggleResearchPublished,
  reorderResearch,
} from "@/lib/admin/actions/research";
import type { Research } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { ResearchFormValues } from "@/lib/admin/schemas";

type ResearchRow = Research & AdminRow;

const BLANK: ResearchFormValues = {
  title: "",
  venue: "",
  year: "",
  type: "paper",
  abstract: "",
  authors: [],
  links: {},
  tags: [],
  featured: false,
  published: true,
};

export function ResearchClient({ initialItems }: { initialItems: ResearchRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<ResearchRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is ResearchRow => Boolean(p));
    setItems(reordered);
    const result = await reorderResearch(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: ResearchRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleResearchPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteResearch(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: ResearchFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createResearch(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateResearch(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: ResearchFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            title: editing.title,
            venue: editing.venue,
            year: editing.year,
            type: editing.type,
            abstract: editing.abstract,
            authors: editing.authors,
            links: editing.links,
            tags: editing.tags,
            featured: editing.featured,
            published: editing.published,
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Research"
        description="Papers, talks, and publications shown in Safari and on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add research</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No research entries yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    {item.featured && <Badge variant="accent">Featured</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-light">
                    {item.venue} · {item.year}
                  </p>
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add research" : "Edit research"}>
        {drawerDefaults && (
          <ResearchForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add research" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
