"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { TagListInput } from "@/components/admin/TagListInput";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/admin/schemas";

interface BlogPostFormProps {
  defaultValues: BlogPostFormValues;
  onSubmit: (values: BlogPostFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function BlogPostForm({ defaultValues, onSubmit, onCancel, submitLabel }: BlogPostFormProps) {
  const [mode, setMode] = useState<"write" | "link">(defaultValues.externalUrl ? "link" : "write");
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { ...defaultValues, publishedAt: toDateInputValue(defaultValues.publishedAt) },
  });

  async function submit(values: BlogPostFormValues) {
    const cleaned =
      mode === "write" ? { ...values, externalUrl: "" } : { ...values, content: "" };
    const errorMessage = await onSubmit(cleaned);
    if (errorMessage) setError("root", { message: errorMessage });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {errors.root && (
        <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {errors.root.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} className={inputClass} />
        </FormField>
        <FormField label="Slug" hint="Used in the URL: /blog/your-slug" error={errors.slug?.message}>
          <input {...register("slug")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Excerpt" error={errors.excerpt?.message}>
        <textarea {...register("excerpt")} rows={2} className={textareaClass} />
      </FormField>

      <FormField label="Cover image" hint="Optional">
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => <MediaPicker value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Tags">
        <Controller
          control={control}
          name="tags"
          render={({ field }) => <TagListInput value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Content source">
        <div className="inline-flex rounded-lg border border-border p-0.5">
          {(["write", "link"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                mode === m ? "bg-accent-subtle text-accent" : "text-muted hover:text-foreground"
              )}
            >
              {m === "write" ? "Write here" : "Link out"}
            </button>
          ))}
        </div>
      </FormField>

      {mode === "write" ? (
        <FormField label="Content" hint="Markdown supported" error={errors.content?.message}>
          <textarea {...register("content")} rows={10} className={textareaClass} />
        </FormField>
      ) : (
        <FormField label="External URL" hint="e.g. a Medium or Substack post" error={errors.externalUrl?.message}>
          <input {...register("externalUrl")} className={inputClass} />
        </FormField>
      )}

      <FormField label="Published at" hint="Optional — shown as the post date">
        <input type="date" {...register("publishedAt")} className={inputClass} />
      </FormField>

      <div className="border-t border-border-subtle pt-4">
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-foreground">
              <PublishSwitch published={field.value} onChange={field.onChange} />
              {field.value ? "Published" : "Draft"}
            </label>
          )}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-border-subtle pt-5">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
