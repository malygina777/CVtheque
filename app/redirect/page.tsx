import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRole } from "@/lib/getRole/getRole";

export default async function RedirectPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user?.id) {
    redirect("/connexion");
  }

  const role = await getRole(session.user.id);

  if (role?.role === "user") {
    redirect("/userPage");
  }

  if (role?.role === "admin" || role?.role === "teacher") {
    redirect("/adminTeacherPage");
  }

  redirect("/register");
}
