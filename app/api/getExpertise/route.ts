import { NextResponse } from "next/server";
import { getExpertise } from "@/lib/getExpertise/getExpertise";

export async function GET() {
  try {
    const data = await getExpertise();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error("GET /api/getExpertise error:", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
