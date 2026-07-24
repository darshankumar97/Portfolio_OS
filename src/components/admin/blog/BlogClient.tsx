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
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogPostPublished,
  reorderBlogPosts,
} from "@/lib/admin/actions/blog";
import type { BlogPost } from "@/types/content";
import type { AdminRow } from "@/lib/admin/queries";
import type { BlogPostFormValues } from "@/lib/admin/schemas";

type BlogPostRow = BlogPost & AdminRow;

const BLANK: BlogPostFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  externalUrl: "",
  coverImage: "",
  tags: [],
  publishedAt: "",
  published: true,
};

export function BlogClient({ initialItems }: { initialItems: BlogPostRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<BlogPostRow | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReorder(nextIds: string[]) {
    const reordered = nextIds.map((id) => items.find((p) => p.id === id)).filter((p): p is BlogPostRow => Boolean(p));
    setItems(reordered);
    const result = await reorderBlogPosts(nextIds);
    if (!result.ok) setError(result.error);
  }

  async function handleTogglePublished(item: BlogPostRow) {
    const next = !item.published;
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: next } : p)));
    const result = await toggleBlogPostPublished(item.id, next);
    if (!result.ok) {
      setError(result.error);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, published: !next } : p)));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((p) => p.id !== id));
    const result = await deleteBlogPost(id);
    if (!result.ok) {
      setError(result.error);
      setItems(prev);
    }
  }

  async function handleSubmit(values: BlogPostFormValues): Promise<string | void> {
    if (editing === "new") {
      const result = await createBlogPost(values);
      if (!result.ok) return result.error;
      setItems((prev) => [...prev, { ...result.data, order: prev.length, published: values.published }]);
    } else if (editing) {
      const result = await updateBlogPost(editing.id, values);
      if (!result.ok) return result.error;
      setItems((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...result.data, order: p.order, published: values.published } : p))
      );
    }
    setEditing(null);
  }

  const drawerDefaults: BlogPostFormValues | null =
    editing === "new"
      ? BLANK
      : editing
        ? {
            slug: editing.slug,
            title: editing.title,
            excerpt: editing.excerpt,
            content: editing.content ?? "",
            externalUrl: editing.externalUrl ?? "",
            coverImage: editing.coverImage ?? "",
            tags: editing.tags,
            publishedAt: editing.publishedAt ?? "",
            published: editing.published,
          }
        : null;

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Writing shown on the public site — write in-app or link out to an external post."
        action={<Button onClick={() => setEditing("new")}>+ Add post</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {items.length === 0 ? (
        <EmptyState message="No posts yet — add your first one." />
      ) : (
        <DndListContainer ids={items.map((p) => p.id)} onReorder={handleReorder}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div className="flex items-center gap-3 pr-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-light">
                    {item.externalUrl ? "Link out" : "Written here"} · /blog/{item.slug}
                  </p>
                </div>
                <PublishSwitch published={item.published} onChange={() => handleTogglePublished(item)} />
                <RowActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </SortableRow>
          ))}
        </DndListContainer>
      )}

      <Drawer open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add post" : "Edit post"}>
        {drawerDefaults && (
          <BlogPostForm
            key={editing === "new" ? "new" : editing?.id}
            defaultValues={drawerDefaults}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Add post" : "Save changes"}
          />
        )}
      </Drawer>
    </div>
  );
}
