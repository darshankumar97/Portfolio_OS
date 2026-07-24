"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";
import { socialLinkSchema, SOCIAL_ICON_OPTIONS, type SocialLinkFormValues } from "@/lib/admin/schemas";

interface SocialLinkFormProps {
  defaultValues: SocialLinkFormValues;
  onSubmit: (values: SocialLinkFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function SocialLinkForm({ defaultValues, onSubmit, onCancel, submitLabel }: SocialLinkFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinkFormValues>({ resolver: zodResolver(socialLinkSchema), defaultValues });

  async function submit(values: SocialLinkFormValues) {
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

      <FormField label="URL" hint="Use mailto: for email links" error={errors.url?.message}>
        <input {...register("url")} className={inputClass} />
      </FormField>

      <FormField label="Icon">
        <select {...register("icon")} className={inputClass}>
          {SOCIAL_ICON_OPTIONS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </FormField>

      <label className="flex items-center gap-2 border-t border-border-subtle pt-4 text-sm text-foreground">
        <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-border" />
        Visible on site
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
