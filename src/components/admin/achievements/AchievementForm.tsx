"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { achievementSchema, type AchievementFormValues } from "@/lib/admin/schemas";

interface AchievementFormProps {
  defaultValues: AchievementFormValues;
  onSubmit: (values: AchievementFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function AchievementForm({ defaultValues, onSubmit, onCancel, submitLabel }: AchievementFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AchievementFormValues>({ resolver: zodResolver(achievementSchema), defaultValues });

  async function submit(values: AchievementFormValues) {
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

      <FormField label="Description" hint="Optional">
        <textarea {...register("description")} rows={3} className={textareaClass} />
      </FormField>

      <FormField label="Date" hint="Optional — e.g. 2024">
        <input {...register("date")} className={inputClass} />
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
