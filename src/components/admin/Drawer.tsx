"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, description, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[9500] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            className="fixed inset-y-0 right-0 z-[9600] flex w-full max-w-lg flex-col border-l border-border bg-surface-elevated shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="flex shrink-0 items-start justify-between border-b border-border-subtle px-6 py-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1 text-muted transition-colors hover:bg-border-subtle hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
