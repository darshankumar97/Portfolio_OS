"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Drawer } from "@/components/admin/Drawer";
import { Button } from "@/components/ui/Button";
import { listMediaAdmin, uploadMedia, type MediaAssetDTO } from "@/lib/admin/actions/media";

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

function isImageAccept(accept: string): boolean {
  return accept.includes("image");
}

function filenameFromUrl(url: string): string {
  try {
    return decodeURIComponent(url.split("/").pop() ?? url);
  } catch {
    return url;
  }
}

function FilePreview({ url, className }: { url: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-surface text-muted-light ${className ?? ""}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4" />
      </svg>
    </div>
  );
}

export function MediaPicker({ value, onChange, accept = "image/*", label = "Choose image" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAssetDTO[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wantsImage = isImageAccept(accept);

  async function openPicker() {
    setOpen(true);
    if (!assets) {
      const list = await listMediaAdmin();
      setAssets(list);
    }
  }

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
    setAssets((prev) => (prev ? [result.data, ...prev] : [result.data]));
    onChange(result.data.url);
    setOpen(false);
  }

  const matchingAssets = assets?.filter((a) => (wantsImage ? a.type === "image" : a.type !== "image"));

  return (
    <div>
      <div className="flex items-center gap-3">
        {value ? (
          wantsImage ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
              <Image src={value} alt="" fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-surface px-1 text-center">
              <FilePreview url={value} />
              <p className="w-full truncate text-[10px] text-muted-light">{filenameFromUrl(value)}</p>
            </div>
          )
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-muted-light">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="M21 16l-5.5-5.5L4 21" />
            </svg>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Button type="button" variant="secondary" size="sm" onClick={openPicker}>
            {label}
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-muted-light hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} title="Media library" description="Pick an existing asset or upload a new one.">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          loading={uploading}
          className="w-full"
        >
          Upload new file
        </Button>
        {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}

        <div className="mt-5 grid grid-cols-3 gap-3">
          {assets === null && <p className="col-span-3 text-sm text-muted-light">Loading…</p>}
          {matchingAssets?.length === 0 && (
            <p className="col-span-3 text-sm text-muted-light">No matching media uploaded yet.</p>
          )}
          {matchingAssets?.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => {
                onChange(asset.url);
                setOpen(false);
              }}
              className="relative aspect-square overflow-hidden rounded-lg border border-border hover:ring-2 hover:ring-accent"
            >
              {wantsImage ? (
                <Image src={asset.url} alt={asset.filename} fill className="object-cover" sizes="120px" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-1 text-center">
                  <FilePreview url={asset.url} className="h-8 w-8 shrink-0" />
                  <p className="w-full truncate text-[10px] text-muted-light">{asset.filename}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
