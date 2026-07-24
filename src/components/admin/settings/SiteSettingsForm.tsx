"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { TagListInput } from "@/components/admin/TagListInput";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { Button } from "@/components/ui/Button";
import { updateSiteSettings } from "@/lib/admin/actions/site-settings";
import { siteSettingsSchema, type SiteSettingsFormValues } from "@/lib/admin/schemas";

export function SiteSettingsForm({ defaultValues }: { defaultValues: SiteSettingsFormValues }) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormValues>({ resolver: zodResolver(siteSettingsSchema), defaultValues });

  async function submit(values: SiteSettingsFormValues) {
    setSaved(false);
    const result = await updateSiteSettings(values);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-5">
      {errors.root && (
        <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {errors.root.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Site name" error={errors.name?.message}>
          <input {...register("name")} className={inputClass} />
        </FormField>
        <FormField label="Tagline" error={errors.tagline?.message}>
          <input {...register("tagline")} className={inputClass} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Domain" hint="e.g. darshankumar.me" error={errors.domain?.message}>
          <input {...register("domain")} className={inputClass} />
        </FormField>
        <FormField label="Canonical URL" hint="e.g. https://darshankumar.me" error={errors.url?.message}>
          <input {...register("url")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Meta description" error={errors.description?.message}>
        <textarea {...register("description")} rows={3} className={textareaClass} />
      </FormField>

      <FormField label="SEO keywords">
        <Controller
          control={control}
          name="keywords"
          render={({ field }) => <TagListInput value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Locale" hint="e.g. en_US" error={errors.locale?.message}>
        <input {...register("locale")} className={inputClass} />
      </FormField>

      <FormField label="Social share image" hint="Used as the default Open Graph image">
        <Controller
          control={control}
          name="ogImageUrl"
          render={({ field }) => <MediaPicker value={field.value} onChange={field.onChange} />}
        />
      </FormField>

      <FormField label="Resume" hint="Shown in Preview.app and linked from the site">
        <Controller
          control={control}
          name="resumeUrl"
          render={({ field }) => (
            <MediaPicker value={field.value} onChange={field.onChange} accept="application/pdf" label="Choose PDF" />
          )}
        />
      </FormField>

      <div className="flex items-center gap-3 border-t border-border-subtle pt-5">
        <Button type="submit" loading={isSubmitting}>
          Save changes
        </Button>
        {saved && <span className="text-sm text-accent">Saved</span>}
      </div>
    </form>
  );
}
