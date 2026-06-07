import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { ProjectSidebar } from "@/components/projects/project-sidebar";
import { AGENTS } from "@/lib/agents/definitions";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({
    where: { id, OR: [{ ownerId: session!.user.id }, { organization: { memberships: { some: { userId: session!.user.id } } } }] },
  });
  if (!project) notFound();

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="flex gap-6 px-4 sm:px-6 lg:px-8">
        <ProjectSidebar projectId={project.id} projectName={project.name} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
