import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRole } from "@/lib/getRole/getRole";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "not_logged" },
        { status: 401 }
      );
    }

    const role = await getRole(session.user.id);

    if (role?.role === "user") {
      return NextResponse.json({ redirectTo: "/userPage" });
    }

    if (role?.role === "admin" || role?.role === "teacher") {
      return NextResponse.json({ redirectTo: "/adminTeacherPage" });
    }

    return NextResponse.json({ redirectTo: "/register" });
  } catch (e) {
    return NextResponse.json(
      { status: "error" },
      { status: 500 }
    );
  }
}