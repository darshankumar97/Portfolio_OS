import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PreviewToggle } from "@/components/admin/PreviewToggle";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { getAdminSession } from "@/lib/auth/current-user";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const dm = await draftMode();

  return (
    <div className="flex h-dvh bg-surface">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface-elevated px-6">
          <p className="text-sm text-muted">{session.email}</p>
          <div className="flex items-center gap-2">
            <PreviewToggle previewing={dm.isEnabled} />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-border-subtle hover:text-foreground"
            >
              <AdminIcon name="external" className="h-3.5 w-3.5" />
              View site
            </a>
            <LogoutButton />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
