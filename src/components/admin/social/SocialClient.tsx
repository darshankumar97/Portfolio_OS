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
import { SocialLinkForm } from "@/components/admin/social/SocialLinkForm";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  toggleSocialLinkPublished,
  reorderSocialLinks,
} from "@/lib/admin/actions/social";
import type { SocialLink } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { SocialLinkFormValues } from "@/lib/admin/schemas";

type SocialLinkRow = SocialLink & AdminRow;

const BLANK: SocialLinkFormValues = { label: "", url: "", icon: "github", published: true };

export function SocialClient({ initialItems }: { initialItems: SocialLinkRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<SocialLinkRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is SocialLinkRow => Boolean(p));
    setItems(reordered);
    const result = await reorderSocialLinks(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: SocialLinkRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleSocialLinkPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteSocialLink(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: SocialLinkFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createSocialLink(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateSocialLink(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: SocialLinkFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? { label: editing.label, url: editing.url, icon: editing.icon, published: editing.published }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Social links"
        description="Shown in the footer, Contact section, and Mail app."
        action={<Button onClick={() => setEditing("new")}>+ Add link</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No social links yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                    <Badge variant="muted">{item.icon}</Badge>
                  </div>
                  <p className="truncate text-xs text-muted-light">{item.url}</p>
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
          <SocialLinkForm
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
