export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-surface-elevated px-6 py-12 text-sm text-muted-light">
      {message}
    </div>
  );
}
