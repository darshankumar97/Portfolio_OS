"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { educationSchema, type EducationFormValues } from "@/lib/admin/schemas";

interface EducationFormProps {
  defaultValues: EducationFormValues;
  onSubmit: (values: EducationFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function EducationForm({ defaultValues, onSubmit, onCancel, submitLabel }: EducationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({ resolver: zodResolver(educationSchema), defaultValues });

  async function submit(values: EducationFormValues) {
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

      <FormField label="Institution" error={errors.institution?.message}>
        <input {...register("institution")} className={inputClass} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Degree" error={errors.degree?.message}>
          <input {...register("degree")} className={inputClass} />
        </FormField>
        <FormField label="Field of study" hint="Optional">
          <input {...register("field")} className={inputClass} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Period" hint="e.g. 2016 – 2020" error={errors.period?.message}>
          <input {...register("period")} className={inputClass} />
        </FormField>
        <FormField label="Location" hint="Optional">
          <input {...register("location")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Description" hint="Optional">
        <textarea {...register("description")} rows={3} className={textareaClass} />
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
