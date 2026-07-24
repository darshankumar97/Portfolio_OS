"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";
import { navigationItemSchema, type NavigationItemFormValues } from "@/lib/admin/schemas";

interface NavigationItemFormProps {
  defaultValues: NavigationItemFormValues;
  onSubmit: (values: NavigationItemFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function NavigationItemForm({ defaultValues, onSubmit, onCancel, submitLabel }: NavigationItemFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NavigationItemFormValues>({ resolver: zodResolver(navigationItemSchema), defaultValues });

  async function submit(values: NavigationItemFormValues) {
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

      <FormField label="Href" hint="e.g. /#work or /blog" error={errors.href?.message}>
        <input {...register("href")} className={inputClass} />
      </FormField>

      <label className="flex items-center gap-2 border-t border-border-subtle pt-4 text-sm text-foreground">
        <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-border" />
        Visible in navigation
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
