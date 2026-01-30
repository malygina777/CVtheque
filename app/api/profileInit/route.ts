export const runtime = "nodejs";
import { profileInitPrisma } from "@/lib/profileInit/profileInitPrisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName, email } = await req.json();

  await profileInitPrisma(firstName, lastName, email, session.user.id);

  return NextResponse.json({ ok: true });
}
