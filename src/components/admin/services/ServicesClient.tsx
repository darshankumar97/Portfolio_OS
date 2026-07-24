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
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import {
  createService,
  updateService,
  deleteService,
  toggleServicePublished,
  reorderServices,
} from "@/lib/admin/actions/services";
import type { Service } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { ServiceFormValues } from "@/lib/admin/schemas";

type ServiceRow = Service & AdminRow;

const BLANK: ServiceFormValues = { title: "", description: "", deliverables: [], published: true };

export function ServicesClient({ initialItems }: { initialItems: ServiceRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<ServiceRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is ServiceRow => Boolean(p));
    setItems(reordered);
    const result = await reorderServices(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: ServiceRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleServicePublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteService(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: ServiceFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createService(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateService(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: ServiceFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? { title: editing.title, description: editing.description, deliverables: editing.deliverables, published: editing.published }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Freelance offerings shown on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add service</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No services yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-light">{item.description}</p>
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add service" : "Edit service"}>
        {drawerDefaults && (
          <ServiceForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add service" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
