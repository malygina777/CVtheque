import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1) Если запрос пришёл ПОСЛЕ /redirect (мы сами его выпустили) — пропускаем
  // чтобы не было цикла
  if (searchParams.get("from") === "redirect") {
    return NextResponse.next();
  }

  // 2) Любая попытка зайти напрямую в защищённые страницы -> на /redirect
  const url = request.nextUrl.clone();
  url.pathname = "/redirect";

  // Передаём, куда человек хотел попасть
  url.searchParams.set("next", pathname);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/adminTeacherPage/:path*", "/userPage/:path*"],
};