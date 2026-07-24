"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { TagListInput } from "@/components/admin/TagListInput";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { experienceSchema, EXPERIENCE_TYPE_OPTIONS, type ExperienceFormValues } from "@/lib/admin/schemas";

interface ExperienceFormProps {
  defaultValues: ExperienceFormValues;
  onSubmit: (values: ExperienceFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function ExperienceForm({ defaultValues, onSubmit, onCancel, submitLabel }: ExperienceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({ resolver: zodResolver(experienceSchema), defaultValues });

  async function submit(values: ExperienceFormValues) {
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
        <FormField label="Company" error={errors.company?.message}>
          <input {...register("company")} className={inputClass} />
        </FormField>
        <FormField label="Role" error={errors.role?.message}>
          <input {...register("role")} className={inputClass} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Period" hint="e.g. 2023 — Present" error={errors.period?.message}>
          <input {...register("period")} className={inputClass} />
        </FormField>
        <FormField label="Location" error={errors.location?.message}>
          <input {...register("location")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Type">
        <select {...register("type")} className={inputClass}>
          {EXPERIENCE_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={3} className={textareaClass} />
      </FormField>

      <FormField label="Achievements">
        <Controller
          control={control}
          name="achievements"
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
