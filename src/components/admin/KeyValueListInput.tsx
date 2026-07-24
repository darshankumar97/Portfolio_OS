"use client";

interface KeyValueItem {
  label: string;
  value: string;
}

interface KeyValueListInputProps {
  value: KeyValueItem[];
  onChange: (next: KeyValueItem[]) => void;
  labelPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
}

export function KeyValueListInput({
  value,
  onChange,
  labelPlaceholder = "Label",
  valuePlaceholder = "Value",
  addLabel = "+ Add",
}: KeyValueListInputProps) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item.label}
            onChange={(e) => onChange(value.map((v, idx) => (idx === i ? { ...v, label: e.target.value } : v)))}
            placeholder={labelPlaceholder}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <input
            value={item.value}
            onChange={(e) => onChange(value.map((v, idx) => (idx === i ? { ...v, value: e.target.value } : v)))}
            placeholder={valuePlaceholder}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="shrink-0 rounded-md border border-border px-2 text-muted hover:bg-border-subtle"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { label: "", value: "" }])}
        className="text-xs text-accent hover:underline"
      >
        {addLabel}
      </button>
    </div>
  );
}
