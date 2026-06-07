import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return <AdminShell>{children}</AdminShell>;
}
