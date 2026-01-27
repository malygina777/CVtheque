import { NextResponse } from "next/server";
import { saveExperience } from "@/lib/saveExperience/saveExperience";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await saveExperience(body);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
