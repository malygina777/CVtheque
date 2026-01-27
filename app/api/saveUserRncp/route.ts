import { NextResponse } from "next/server";
import { createUserRncp } from "@/lib/saveUserRncp/createUserRncp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = Number(body.userId);
    const diplomas = body.diplomas as { rncpId: number; year: number }[];

    if (!userId || !Array.isArray(diplomas) || diplomas.length === 0) {
      return NextResponse.json({ error: "Bad payload" }, { status: 400 });
    }

    await createUserRncp(userId, diplomas);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
