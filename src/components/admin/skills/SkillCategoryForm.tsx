"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@/components/admin/FormField";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Button } from "@/components/ui/Button";
import { skillCategorySchema, SKILL_LEVEL_OPTIONS, type SkillCategoryFormValues } from "@/lib/admin/schemas";

interface SkillCategoryFormProps {
  defaultValues: SkillCategoryFormValues;
  onSubmit: (values: SkillCategoryFormValues) => Promise<string | void>;
  onCancel: () => void;
  submitLabel: string;
}

export function SkillCategoryForm({ defaultValues, onSubmit, onCancel, submitLabel }: SkillCategoryFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SkillCategoryFormValues>({ resolver: zodResolver(skillCategorySchema), defaultValues });

  async function submit(values: SkillCategoryFormValues) {
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

      <FormField label="Category name" hint="e.g. Frontend, Backend & Data" error={errors.name?.message}>
        <input {...register("name")} className={inputClass} />
      </FormField>

      <FormField label="Skills">
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <div className="space-y-2">
              {field.value.map((skill, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={skill.name}
                    onChange={(e) =>
                      field.onChange(field.value.map((s, idx) => (idx === i ? { ...s, name: e.target.value } : s)))
                    }
                    placeholder="Skill name"
                    className={inputClass}
                  />
                  <select
                    value={skill.level ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        field.value.map((s, idx) =>
                          idx === i
                            ? { ...s, level: e.target.value ? (e.target.value as (typeof SKILL_LEVEL_OPTIONS)[number]) : undefined }
                            : s
                        )
                      )
                    }
                    className={`${inputClass} w-36 shrink-0`}
                  >
                    <option value="">No level</option>
                    {SKILL_LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))}
                    className="shrink-0 rounded-md border border-border px-2 text-muted hover:bg-border-subtle"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => field.onChange([...field.value, { name: "", level: undefined }])}
                className="text-xs text-accent hover:underline"
              >
                + Add skill
              </button>
            </div>
          )}
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
