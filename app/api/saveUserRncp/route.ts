import { NextResponse } from "next/server";
import { createUserRncp } from "@/lib/saveUserRncp/createUserRncp";
import { getProfilePrisma } from "@/lib/getProfile/getProfilePrisma";
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
    const profileId = await getProfilePrisma(userId);

    if (!profileId) {
      return NextResponse.json(
        { success: false, error: "Profile not found for this user" },
        { status: 404 },
      );
    }

    const body = await req.json();

    const diplomas = body.diplomas as { rncpId: number; year: number }[];

    if (!userId || !Array.isArray(diplomas) || diplomas.length === 0) {
      return NextResponse.json({ error: "Bad payload" }, { status: 400 });
    }

    await createUserRncp(Number(profileId), diplomas);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
