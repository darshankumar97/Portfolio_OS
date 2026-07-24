"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@/components/admin/FormField";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { certificationSchema, type CertificationFormValues } from "@/lib/admin/schemas";

interface CertificationFormProps {
  defaultValues: CertificationFormValues;
  onSubmit: (values: CertificationFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function CertificationForm({ defaultValues, onSubmit, onCancel, submitLabel }: CertificationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormValues>({ resolver: zodResolver(certificationSchema), defaultValues });

  async function submit(values: CertificationFormValues) {
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

      <FormField label="Name" error={errors.name?.message}>
        <input {...register("name")} className={inputClass} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Issuer" error={errors.issuer?.message}>
          <input {...register("issuer")} className={inputClass} />
        </FormField>
        <FormField label="Issue date" hint="e.g. 2023" error={errors.issueDate?.message}>
          <input {...register("issueDate")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Credential URL" hint="Optional — link to verify">
        <input {...register("credentialUrl")} className={inputClass} />
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
