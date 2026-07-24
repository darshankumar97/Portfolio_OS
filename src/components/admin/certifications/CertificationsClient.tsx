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
import { CertificationForm } from "@/components/admin/certifications/CertificationForm";
import {
  createCertification,
  updateCertification,
  deleteCertification,
  toggleCertificationPublished,
  reorderCertifications,
} from "@/lib/admin/actions/certifications";
import type { Certification } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { CertificationFormValues } from "@/lib/admin/schemas";

type CertificationRow = Certification & AdminRow;

const BLANK: CertificationFormValues = { name: "", issuer: "", issueDate: "", credentialUrl: "", published: true };

export function CertificationsClient({ initialItems }: { initialItems: CertificationRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<CertificationRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is CertificationRow => Boolean(p));
    setItems(reordered);
    const result = await reorderCertifications(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: CertificationRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleCertificationPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteCertification(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: CertificationFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createCertification(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateCertification(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: CertificationFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            name: editing.name,
            issuer: editing.issuer,
            issueDate: editing.issueDate,
            credentialUrl: editing.credentialUrl ?? "",
            published: editing.published,
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Certifications"
        description="Professional certifications shown on the public site."
        action={<Button onClick={() => setEditing("new")}>+ Add certification</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No certifications yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <p className="truncate text-xs text-muted-light">
                    {item.issuer} · {item.issueDate}
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
        title={editing === "new" ? "Add certification" : "Edit certification"}
      >
        {drawerDefaults && (
          <CertificationForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add certification" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
