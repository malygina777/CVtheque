export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createUser } from "@/lib/users/createUser";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const user = await createUser(formData);
    return NextResponse.json({ success: true, user });
  } catch (e: any) {
    console.error("POST /api/users ERROR:", e);
    return NextResponse.json(
      { success: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
