"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { TagListInput } from "@/components/admin/TagListInput";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { researchSchema, RESEARCH_TYPE_OPTIONS, type ResearchFormValues } from "@/lib/admin/schemas";

interface ResearchFormProps {
  defaultValues: ResearchFormValues;
  onSubmit: (values: ResearchFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function ResearchForm({ defaultValues, onSubmit, onCancel, submitLabel }: ResearchFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResearchFormValues>({ resolver: zodResolver(researchSchema), defaultValues });

  async function submit(values: ResearchFormValues) {
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

      <FormField label="Title" error={errors.title?.message}>
        <input {...register("title")} className={inputClass} />
      </FormField>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Venue" error={errors.venue?.message}>
          <input {...register("venue")} className={inputClass} />
        </FormField>
        <FormField label="Year" error={errors.year?.message}>
          <input {...register("year")} className={inputClass} />
        </FormField>
        <FormField label="Type">
          <select {...register("type")} className={inputClass}>
            {RESEARCH_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Abstract" error={errors.abstract?.message}>
        <textarea {...register("abstract")} rows={4} className={textareaClass} />
      </FormField>

      <FormField label="Authors">
        <Controller
          control={control}
          name="authors"
          render={({ field }) => <TagListInput value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Tags">
        <Controller
          control={control}
          name="tags"
          render={({ field }) => <TagListInput value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Links">
        <div className="grid grid-cols-2 gap-3">
          <input {...register("links.pdf")} placeholder="PDF URL" className={inputClass} />
          <input {...register("links.doi")} placeholder="DOI URL" className={inputClass} />
          <input {...register("links.arxiv")} placeholder="arXiv URL" className={inputClass} />
          <input {...register("links.slides")} placeholder="Slides URL" className={inputClass} />
        </div>
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
