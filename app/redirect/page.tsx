import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRole } from "@/lib/getRole/getRole";
import { headers } from "next/headers";

export default async function RedirectPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/connexion");
  }

  const role = await getRole(session.user.id);

  // если роли нет — на регистрацию
  if (!role?.role) {
    redirect("/register");
  }

  // если middleware прислал next — уважаем его
  const next = searchParams.next;

  if (next) {
    redirect(`${next}?from=redirect`);
  }

  // иначе по роли
  if (role.role === "user") redirect("/userPage?from=redirect");
  redirect("/adminTeacherPage?from=redirect");
}