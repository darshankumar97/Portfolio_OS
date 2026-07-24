import type { Metadata } from "next";
import { listProjectsAdmin } from "@/lib/admin/queries";
import { ProjectsClient } from "@/components/admin/projects/ProjectsClient";

export const metadata: Metadata = {
  title: "Projects — DevOS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const projects = await listProjectsAdmin();
  return <ProjectsClient initialProjects={projects} />;
}
