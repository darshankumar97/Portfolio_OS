"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";
import { accentSchema, type AccentFormValues } from "@/lib/admin/schemas";

interface AccentFormProps {
  defaultValues: AccentFormValues;
  onSubmit: (values: AccentFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function AccentForm({ defaultValues, onSubmit, onCancel, submitLabel }: AccentFormProps) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccentFormValues>({ resolver: zodResolver(accentSchema), defaultValues });

  const currentValue = watch("value");

  async function submit(values: AccentFormValues) {
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

      <FormField label="Label" error={errors.label?.message}>
        <input {...register("label")} className={inputClass} />
      </FormField>

      <FormField label="Color" error={errors.value?.message}>
        <div className="flex items-center gap-2">
          <input type="color" {...register("value")} className="h-9 w-12 rounded-md border border-border bg-surface" />
          <input {...register("value")} className={inputClass} placeholder="#2563eb" />
          <span className="h-9 w-9 shrink-0 rounded-md border border-border" style={{ backgroundColor: currentValue }} />
        </div>
      </FormField>

      <label className="flex items-center gap-2 border-t border-border-subtle pt-4 text-sm text-foreground">
        <input type="checkbox" {...register("isDefault")} className="h-4 w-4 rounded border-border" />
        Set as default accent
      </label>

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
