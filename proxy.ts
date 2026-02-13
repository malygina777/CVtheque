// proxy.ts (В КОРНЕ ПРОЕКТА: рядом с папкой app/)
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const LOGIN_PATH = "/connexion";

// Подставь свои реальные значения ролей:
function getHomeByRole(role?: string | null) {
  if (role === "teacher" || role === "admin") {
    return "/adminTeacherPage";
  }
  return "/userPage";
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1) Публичные страницы (если нужно)
  if (pathname.startsWith("/connexion") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  // 2) Если пользователь зашёл на /redirect — отправляем по роли
  // (обычно ты после логина делаешь router.push("/redirect"))
  if (pathname === "/redirect") {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.redirect(
        new URL(`${LOGIN_PATH}?next=/redirect`, request.url),
      );
    }

    // ВАЖНО: поле роли зависит от твоей конфигурации Better Auth.
    // Часто это session.user.role или session.user.roles.
    const role =
      (session.user as any).role ??
      (Array.isArray((session.user as any).roles)
        ? (session.user as any).roles[0]
        : undefined);

    return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
  }

  // 3) Защита страниц
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    const next = encodeURIComponent(pathname + (search || ""));
    return NextResponse.redirect(
      new URL(`${LOGIN_PATH}?next=${next}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminTeacherPage/:path*", "/userPage/:path*", "/redirect"],
};
