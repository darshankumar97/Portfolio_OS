"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DndListContainer } from "@/components/admin/DndListContainer";
import { SortableRow } from "@/components/admin/SortableRow";
import { RowActions } from "@/components/admin/RowActions";
import { Drawer } from "@/components/admin/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { WallpaperForm } from "@/components/admin/appearance/WallpaperForm";
import { AccentForm } from "@/components/admin/appearance/AccentForm";
import {
  createWallpaper,
  updateWallpaper,
  deleteWallpaper,
  reorderWallpapers,
  createAccent,
  updateAccent,
  deleteAccent,
  reorderAccents,
} from "@/lib/admin/actions/appearance";
import type { Wallpaper, Accent } from "@/types/content";
import type { WallpaperFormValues, AccentFormValues } from "@/lib/admin/schemas";

const BLANK_WALLPAPER: WallpaperFormValues = { label: "", gradient: "", imageUrl: "", isDefault: false };
const BLANK_ACCENT: AccentFormValues = { label: "", value: "#2563eb", isDefault: false };

export function AppearanceClient({
  initialWallpapers,
  initialAccents,
}: {
  initialWallpapers: Wallpaper[];
  initialAccents: Accent[];
}) {
  const [wallpapers, setWallpapers] = useState(initialWallpapers);
  const [accents, setAccents] = useState(initialAccents);
  const [editingWallpaper, setEditingWallpaper] = useState<Wallpaper | "new" | null>(null);
  const [editingAccent, setEditingAccent] = useState<Accent | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorderWallpapers(nextIds: string[]) {
    const reordered = nextIds.map((id) => wallpapers.find((w) => w.id === id)).filter((w): w is Wallpaper => Boolean(w));
    setWallpapers(reordered);
    const result = await reorderWallpapers(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleDeleteWallpaper(id: string) {
    const prev = wallpapers;
    setWallpapers((cur) => cur.filter((w) => w.id !== id));
    const result = await deleteWallpaper(id);
    if (!result.ok) {
      setError(result.error);
      setWallpapers(prev);
    }
  }

  async function handleSubmitWallpaper(values: WallpaperFormValues): Promise<string | void> {
    if (editingWallpaper === "new") {
      const result = await createWallpaper(values);
      if (!result.ok) return result.error;
      setWallpapers((prev) => [
        ...(values.isDefault ? prev.map((w) => ({ ...w, isDefault: false })) : prev),
        result.data,
      ]);
    } else if (editingWallpaper) {
      const result = await updateWallpaper(editingWallpaper.id, values);
      if (!result.ok) return result.error;
      setWallpapers((prev) =>
        prev.map((w) => (w.id === editingWallpaper.id ? result.data : values.isDefault ? { ...w, isDefault: false } : w))
      );
    }
    setEditingWallpaper(null);
  }

  async function handleReorderAccents(nextIds: string[]) {
    const reordered = nextIds.map((id) => accents.find((a) => a.id === id)).filter((a): a is Accent => Boolean(a));
    setAccents(reordered);
    const result = await reorderAccents(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleDeleteAccent(id: string) {
    const prev = accents;
    setAccents((cur) => cur.filter((a) => a.id !== id));
    const result = await deleteAccent(id);
    if (!result.ok) {
      setError(result.error);
      setAccents(prev);
    }
  }

  async function handleSubmitAccent(values: AccentFormValues): Promise<string | void> {
    if (editingAccent === "new") {
      const result = await createAccent(values);
      if (!result.ok) return result.error;
      setAccents((prev) => [
        ...(values.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev),
        result.data,
      ]);
    } else if (editingAccent) {
      const result = await updateAccent(editingAccent.id, values);
      if (!result.ok) return result.error;
      setAccents((prev) =>
        prev.map((a) => (a.id === editingAccent.id ? result.data : values.isDefault ? { ...a, isDefault: false } : a))
      );
    }
    setEditingAccent(null);
  }

  const wallpaperDefaults: WallpaperFormValues | null =
    editingWallpaper === "new"
      ? BLANK_WALLPAPER
      : editingWallpaper
        ? {
            label: editingWallpaper.label,
            gradient: editingWallpaper.gradient ?? "",
            imageUrl: editingWallpaper.imageUrl ?? "",
            isDefault: editingWallpaper.isDefault,
          }
        : null;

  const accentDefaults: AccentFormValues | null =
    editingAccent === "new"
      ? BLANK_ACCENT
      : editingAccent
        ? { label: editingAccent.label, value: editingAccent.value, isDefault: editingAccent.isDefault }
        : null;

  return (
    <div className="space-y-10">
      {error && <ErrorBanner message={error} />}

      <div>
        <AdminPageHeader
          title="Wallpapers"
          description="Desktop backgrounds available in System Settings."
          action={<Button onClick={() => setEditingWallpaper("new")}>+ Add wallpaper</Button>}
        />
        <DndListContainer ids={wallpapers.map((w) => w.id)} onReorder={handleReorderWallpapers}>
          {wallpapers.map((wallpaper) => (
            <SortableRow key={wallpaper.id} id={wallpaper.id}>
              <div className="flex items-center gap-3 pr-4">
                <div
                  className="h-10 w-14 shrink-0 rounded-md border border-border bg-cover bg-center"
                  style={{
                    background: wallpaper.imageUrl ? `url(${wallpaper.imageUrl})` : wallpaper.gradient,
                    backgroundSize: "cover",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{wallpaper.label}</p>
                    {wallpaper.isDefault && <Badge variant="accent">Default</Badge>}
                  </div>
                </div>
                <RowActions onEdit={() => setEditingWallpaper(wallpaper)} onDelete={() => handleDeleteWallpaper(wallpaper.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      </div>

      <div>
        <AdminPageHeader
          title="Accent colors"
          description="Accent color choices available in System Settings."
          action={<Button onClick={() => setEditingAccent("new")}>+ Add accent</Button>}
        />
        <DndListContainer ids={accents.map((a) => a.id)} onReorder={handleReorderAccents}>
          {accents.map((accent) => (
            <SortableRow key={accent.id} id={accent.id}>
              <div className="flex items-center gap-3 pr-4">
                <span className="h-8 w-8 shrink-0 rounded-full border border-border" style={{ backgroundColor: accent.value }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{accent.label}</p>
                    {accent.isDefault && <Badge variant="accent">Default</Badge>}
                  </div>
                  <p className="text-xs text-muted-light">{accent.value}</p>
                </div>
                <RowActions onEdit={() => setEditingAccent(accent)} onDelete={() => handleDeleteAccent(accent.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      </div>

      <Drawer
        open={editingWallpaper !== null}
        onClose={() => setEditingWallpaper(null)}
        title={editingWallpaper === "new" ? "Add wallpaper" : "Edit wallpaper"}
      >
        {wallpaperDefaults && (
          <WallpaperForm
            key={editingWallpaper === "new" ? "new" : editingWallpaper?.id}
            defaultValues={wallpaperDefaults}
            onSubmit={handleSubmitWallpaper}
            onCancel={() => setEditingWallpaper(null)}
            submitLabel={editingWallpaper === "new" ? "Add wallpaper" : "Save changes"}
          />
        )}
      </Drawer>

      <Drawer
        open={editingAccent !== null}
        onClose={() => setEditingAccent(null)}
        title={editingAccent === "new" ? "Add accent" : "Edit accent"}
      >
        {accentDefaults && (
          <AccentForm
            key={editingAccent === "new" ? "new" : editingAccent?.id}
            defaultValues={accentDefaults}
            onSubmit={handleSubmitAccent}
            onCancel={() => setEditingAccent(null)}
            submitLabel={editingAccent === "new" ? "Add accent" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
