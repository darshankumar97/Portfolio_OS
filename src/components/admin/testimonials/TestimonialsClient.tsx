"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DndListContainer } from "@/components/admin/DndListContainer";
import { SortableRow } from "@/components/admin/SortableRow";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { RowActions } from "@/components/admin/RowActions";
import { Drawer } from "@/components/admin/Drawer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
  reorderTestimonials,
} from "@/lib/admin/actions/testimonials";
import type { Testimonial } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { TestimonialFormValues } from "@/lib/admin/schemas";

type TestimonialRow = Testimonial & AdminRow;

const BLANK: TestimonialFormValues = { name: "", role: "", company: "", quote: "", avatarUrl: "", published: true };

export function TestimonialsClient({ initialItems }: { initialItems: TestimonialRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<TestimonialRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is TestimonialRow => Boolean(p));
    setItems(reordered);
    const result = await reorderTestimonials(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: TestimonialRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleTestimonialPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteTestimonial(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: TestimonialFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createTestimonial(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateTestimonial(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: TestimonialFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            name: editing.name,
            role: editing.role,
            company: editing.company ?? "",
            quote: editing.quote,
            avatarUrl: editing.avatarUrl ?? "",
            published: editing.published,
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Quotes from collaborators shown on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add testimonial</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No testimonials yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                {item.avatarUrl ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-surface">
                    <Image src={item.avatarUrl} alt="" fill className="object-cover" sizes="32px" />
                  </div>
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded-full border border-dashed border-border" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <p className="truncate text-xs text-muted-light">
                    {item.role}
                    {item.company ? ` · ${item.company}` : ""}
                  </p>
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
        title={editing === "new" ? "Add testimonial" : "Edit testimonial"}
      >
        {drawerDefaults && (
          <TestimonialForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add testimonial" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
