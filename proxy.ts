import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getRole } from "./lib/getRole/getRole";

type Role = "admin" | "teacher" | "user" | null;

function isPathStartWith(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/");
}

async function getAuth(
  request: NextRequest,
): Promise<{ isLoggedIn: boolean; role: Role }> {
  const session = await auth.api.getSession({ headers: request.headers });

  const userId = session?.user?.id;
  if (!userId) {
    return { isLoggedIn: false, role: null };
  }

  const roleOfUser = await getRole(userId);

  if (!roleOfUser) {
    return { isLoggedIn: true, role: null };
  }

  return { isLoggedIn: true, role: (roleOfUser.role as Role) ?? "user" };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { isLoggedIn, role } = await getAuth(request);

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }

  if (role === "user" && isPathStartWith(pathname, "/adminTheacherPage")) {
    return NextResponse.redirect(new URL("/userPage", request.url));
  }

  if (
    (role === "admin" || role === "teacher") &&
    isPathStartWith(pathname, "/userPage")
  ) {
    return NextResponse.redirect(new URL("/adminTheacherPage", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminTheacherPage/:path*", "/userPage/:path*"],
};
