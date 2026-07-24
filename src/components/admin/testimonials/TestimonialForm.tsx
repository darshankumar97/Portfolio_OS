"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/admin/schemas";

interface TestimonialFormProps {
  defaultValues: TestimonialFormValues;
  onSubmit: (values: TestimonialFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function TestimonialForm({ defaultValues, onSubmit, onCancel, submitLabel }: TestimonialFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({ resolver: zodResolver(testimonialSchema), defaultValues });

  async function submit(values: TestimonialFormValues) {
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

      <FormField label="Avatar" hint="Optional">
        <Controller
          control={control}
          name="avatarUrl"
          render={({ field }) => <MediaPicker value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Name" error={errors.name?.message}>
          <input {...register("name")} className={inputClass} />
        </FormField>
        <FormField label="Role" error={errors.role?.message}>
          <input {...register("role")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Company" hint="Optional">
        <input {...register("company")} className={inputClass} />
      </FormField>

      <FormField label="Quote" error={errors.quote?.message}>
        <textarea {...register("quote")} rows={4} className={textareaClass} />
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
