"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@/components/admin/FormField";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { Button } from "@/components/ui/Button";
import { wallpaperSchema, type WallpaperFormValues } from "@/lib/admin/schemas";

interface WallpaperFormProps {
  defaultValues: WallpaperFormValues;
  onSubmit: (values: WallpaperFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function WallpaperForm({ defaultValues, onSubmit, onCancel, submitLabel }: WallpaperFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<WallpaperFormValues>({ resolver: zodResolver(wallpaperSchema), defaultValues });

  async function submit(values: WallpaperFormValues) {
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

      <FormField label="Background image" hint="Preferred — used if set">
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => <MediaPicker value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Or CSS gradient" hint='Advanced fallback, e.g. "linear-gradient(135deg, #1e3a8a, #db2777)"'>
        <input {...register("gradient")} className={inputClass} />
      </FormField>

      <label className="flex items-center gap-2 border-t border-border-subtle pt-4 text-sm text-foreground">
        <input type="checkbox" {...register("isDefault")} className="h-4 w-4 rounded border-border" />
        Set as default wallpaper
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
