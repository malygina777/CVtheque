import { NextResponse } from "next/server";
import { natureActivityPrisma } from "@/lib/nuture-activity/nature-activity";

export async function GET() {
  const data = await natureActivityPrisma();

  return NextResponse.json(data);
}
