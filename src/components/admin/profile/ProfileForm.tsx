"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { KeyValueListInput } from "@/components/admin/KeyValueListInput";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "@/lib/admin/actions/profile";
import { profileSchema, type ProfileFormValues } from "@/lib/admin/schemas";

export function ProfileForm({ defaultValues }: { defaultValues: ProfileFormValues }) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema), defaultValues });

  async function submit(values: ProfileFormValues) {
    setSaved(false);
    const result = await updateProfile(values);
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

      <FormField label="Avatar">
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
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Headline" error={errors.headline?.message}>
        <textarea {...register("headline")} rows={2} className={textareaClass} />
      </FormField>

      <FormField label="Subheadline" error={errors.subheadline?.message}>
        <textarea {...register("subheadline")} rows={2} className={textareaClass} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Location" error={errors.location?.message}>
          <input {...register("location")} className={inputClass} />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <input {...register("email")} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Availability" error={errors.availability?.message}>
        <input {...register("availability")} className={inputClass} />
      </FormField>

      <FormField label="Bio" error={errors.bio?.message}>
        <textarea {...register("bio")} rows={5} className={textareaClass} />
      </FormField>

      <FormField label="Highlights" hint="Short stat callouts shown in the Hero section">
        <Controller
          control={control}
          name="highlights"
          render={({ field }) => (
            <KeyValueListInput
              value={field.value}
              onChange={field.onChange}
              labelPlaceholder="e.g. Focus"
              valuePlaceholder="e.g. Systems & Product Engineering"
              addLabel="+ Add highlight"
            />
          )}
        />
      </FormField>

      <FormField label="Audiences" hint="Who you're speaking to — shown in the About section">
        <Controller
          control={control}
          name="audiences"
          render={({ field }) => (
            <div className="space-y-3">
              {field.value.map((audience, i) => (
                <div key={audience.id} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex gap-2">
                    <input
                      value={audience.title}
                      onChange={(e) =>
                        field.onChange(field.value.map((a, idx) => (idx === i ? { ...a, title: e.target.value } : a)))
                      }
                      placeholder="Title"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))}
                      className="shrink-0 rounded-md border border-border px-2 text-muted hover:bg-border-subtle"
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    value={audience.description}
                    onChange={(e) =>
                      field.onChange(
                        field.value.map((a, idx) => (idx === i ? { ...a, description: e.target.value } : a))
                      )
                    }
                    placeholder="Description"
                    rows={2}
                    className={textareaClass}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  field.onChange([
                    ...field.value,
                    { id: crypto.randomUUID(), title: "", description: "" },
                  ])
                }
                className="text-xs text-accent hover:underline"
              >
                + Add audience
              </button>
            </div>
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
