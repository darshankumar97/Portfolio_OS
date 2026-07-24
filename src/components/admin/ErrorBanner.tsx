export function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}
