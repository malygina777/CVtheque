import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRole } from "@/lib/getRole/getRole";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    const dbUser = await getRole(session.user.id); // например вернёт { role: "admin" }

    return NextResponse.json(
      { role: dbUser?.role ?? "user", name: dbUser?.name },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
