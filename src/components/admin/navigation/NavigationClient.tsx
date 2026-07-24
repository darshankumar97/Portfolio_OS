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
import { NavigationItemForm } from "@/components/admin/navigation/NavigationItemForm";
import {
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  toggleNavigationItemPublished,
  reorderNavigationItems,
  type NavigationItemRow,
} from "@/lib/admin/actions/navigation";
import type { AdminRow } from "@/lib/admin/queries";
import type { NavigationItemFormValues } from "@/lib/admin/schemas";

type NavRow = NavigationItemRow & AdminRow;

const BLANK: NavigationItemFormValues = { label: "", href: "", published: true };

export function NavigationClient({ initialItems }: { initialItems: NavRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<NavRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is NavRow => Boolean(p));
    setItems(reordered);
    const result = await reorderNavigationItems(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: NavRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleNavigationItemPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteNavigationItem(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: NavigationItemFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createNavigationItem(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateNavigationItem(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: NavigationItemFormValues | null =
    editing === "new" ? BLANK : editing ? { label: editing.label, href: editing.href, published: editing.published } : null;

  return (
    <div>
      <AdminPageHeader
        title="Navigation"
        description="Header links on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add link</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No navigation links yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                  <p className="truncate text-xs text-muted-light">{item.href}</p>
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add link" : "Edit link"}>
        {drawerDefaults && (
          <NavigationItemForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add link" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
