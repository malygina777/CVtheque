import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRole } from "@/lib/getRole/getRole";
import { toggleCandidatePrisma } from "@/lib/toggleCandidatePrisma/toggleCandidatePrisma";

export async function POST(req: Request) {
  const { candidateId } = (await req.json()) as { candidateId: string };
  const id = Number(candidateId);

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const res = await getRole(session.user.id);

  if (res?.role === "admin") {
    const res = await toggleCandidatePrisma(id);
    console.log(res);
    return NextResponse.json({ res }, { status: 200 });
  }
}
