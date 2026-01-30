export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createUser } from "@/lib/users/createUser";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const formData = await req.formData();
    const user = await createUser(formData, userId);
    return NextResponse.json({ success: true, user });
  } catch (e: any) {
    console.error("POST /api/users ERROR:", e);
    return NextResponse.json(
      { success: false, error: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
