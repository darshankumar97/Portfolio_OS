"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { TagListInput } from "@/components/admin/TagListInput";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { serviceSchema, type ServiceFormValues } from "@/lib/admin/schemas";

interface ServiceFormProps {
  defaultValues: ServiceFormValues;
  onSubmit: (values: ServiceFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function ServiceForm({ defaultValues, onSubmit, onCancel, submitLabel }: ServiceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({ resolver: zodResolver(serviceSchema), defaultValues });

  async function submit(values: ServiceFormValues) {
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

      <FormField label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={3} className={textareaClass} />
      </FormField>

      <FormField label="Deliverables">
        <Controller
          control={control}
          name="deliverables"
          render={({ field }) => <TagListInput value={field.value} onChange={field.onChange} />}
        />
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
