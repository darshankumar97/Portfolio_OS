interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, hint, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-muted">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-light">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent";

export const textareaClass = `${inputClass} resize-y`;
