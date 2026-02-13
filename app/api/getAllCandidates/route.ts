import { NextResponse } from "next/server";
import { getAllCandidatesPrisma } from "@/lib/getAllCandidates/getAllCandidates";
import { auth } from "@/lib/auth";
import { getRole } from "@/lib/getRole/getRole";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    const res = await getRole(session?.user?.id);
    if (res?.role) {
      const data = await getAllCandidatesPrisma(res?.role);
      return NextResponse.json({
        candidates: data,
        role: res.role,
      });
    }
  } catch (e) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
