import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Topbar user={session.user} />
        <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
