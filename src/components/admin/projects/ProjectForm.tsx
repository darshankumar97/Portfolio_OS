"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { TagListInput } from "@/components/admin/TagListInput";
import { KeyValueListInput } from "@/components/admin/KeyValueListInput";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import {
  projectSchema,
  PROJECT_CATEGORY_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  type ProjectFormValues,
} from "@/lib/admin/schemas";

interface ProjectFormProps {
  defaultValues: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function ProjectForm({ defaultValues, onSubmit, onCancel, submitLabel }: ProjectFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  async function submit(values: ProjectFormValues) {
    const errorMessage = await onSubmit(values);
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
        <FormField label="Slug" hint="Used in the URL: /projects/your-slug" error={errors.slug?.message}>
          <input {...register("slug")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Tagline" error={errors.tagline?.message}>
        <input {...register("tagline")} className={inputClass} />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={3} className={textareaClass} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Problem" error={errors.problem?.message}>
          <textarea {...register("problem")} rows={3} className={textareaClass} />
        </FormField>
        <FormField label="Solution" error={errors.solution?.message}>
          <textarea {...register("solution")} rows={3} className={textareaClass} />
        </FormField>
      </div>

      <FormField label="Impact" hint="Concrete, quantified outcomes">
        <Controller
          control={control}
          name="impact"
          render={({ field }) => <TagListInput value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Technologies">
        <Controller
          control={control}
          name="technologies"
          render={({ field }) => <TagListInput value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category">
          <select {...register("category")} className={inputClass}>
            {PROJECT_CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Status">
          <select {...register("status")} className={inputClass}>
            {PROJECT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Cover image">
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => <MediaPicker value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Gallery">
        <Controller
          control={control}
          name="gallery"
          render={({ field }) => (
            <div className="space-y-3">
              {field.value.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {field.value.map((item, i) => (
                    <div key={`${item.url}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.alt ?? ""} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <MediaPicker
                value=""
                label="Add gallery image"
                onChange={(url) => {
                  if (!url) return;
                  field.onChange([...field.value, { url }]);
                }}
              />
            </div>
          )}
        />
      </FormField>

      <FormField label="Links">
        <div className="grid grid-cols-2 gap-3">
          <input {...register("links.live")} placeholder="Live URL" className={inputClass} />
          <input {...register("links.github")} placeholder="GitHub URL" className={inputClass} />
          <input {...register("links.demo")} placeholder="Demo URL" className={inputClass} />
          <input {...register("links.paper")} placeholder="Paper URL" className={inputClass} />
        </div>
      </FormField>

      <FormField label="Metrics" hint="e.g. label: “Users”, value: “12K”">
        <Controller
          control={control}
          name="metrics"
          render={({ field }) => (
            <KeyValueListInput value={field.value} onChange={field.onChange} addLabel="+ Add metric" />
          )}
        />
      </FormField>

      <div className="flex items-center gap-6 border-t border-border-subtle pt-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-border" />
          Featured
        </label>
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
