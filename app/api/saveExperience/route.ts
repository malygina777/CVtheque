import { NextResponse } from "next/server";
import { saveExperience } from "@/lib/saveExperience/saveExperience";
import { auth } from "@/lib/auth";
import { getProfilePrisma } from "@/lib/getProfile/getProfilePrisma";

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

    const body = await req.json();

    if (!Array.isArray(body) || !profileId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await saveExperience(body, profileId);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
