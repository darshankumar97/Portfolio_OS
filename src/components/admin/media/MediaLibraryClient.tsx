"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { Button } from "@/components/ui/Button";
import { deleteMedia, uploadMedia, type MediaAssetDTO } from "@/lib/admin/actions/media";
import { AdminIcon } from "@/components/admin/AdminIcon";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryClient({ initialAssets }: { initialAssets: MediaAssetDTO[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadMedia(formData);
    setUploading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAssets((prev) => [result.data, ...prev]);
  }

  async function handleDelete(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    const result = await deleteMedia(id);
    if (!result.ok) setError(result.error);
  }

  async function copyUrl(asset: MediaAssetDTO) {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId((cur) => (cur === asset.id ? null : cur)), 1500);
  }

  return (
    <div>
      <AdminPageHeader
        title="Media library"
        description="Every image, video, and document uploaded across the admin panel."
        action={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
            <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
              Upload file
            </Button>
          </>
        }
      />

      {error && <ErrorBanner message={error} />}

      {assets.length === 0 ? (
        <EmptyState message="No media uploaded yet — upload an image, video, or PDF to get started." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <div key={asset.id} className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
              <div className="relative aspect-video bg-surface">
                {asset.type === "image" ? (
                  <Image src={asset.url} alt={asset.filename} fill className="object-cover" sizes="240px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-light">
                    <AdminIcon name={asset.type === "video" ? "media" : "experience"} className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-foreground" title={asset.filename}>
                  {asset.filename}
                </p>
                <p className="mt-0.5 text-xs text-muted-light">{formatBytes(asset.size)}</p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset)}
                    className="text-xs text-accent hover:underline"
                  >
                    {copiedId === asset.id ? "Copied!" : "Copy URL"}
                  </button>

                  {confirmingId === asset.id ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => handleDelete(asset.id)}
                        className="rounded-md bg-red-600 px-2 py-0.5 font-medium text-white hover:bg-red-700"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="text-muted hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(asset.id)}
                      className="text-xs text-muted-light hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
