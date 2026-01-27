import { NextResponse } from "next/server";
import { getDiplomaCanditatePrisma } from "@/lib/getDiplomaCanditate/getDiplomaCanditatePrisma";

export async function GET() {
  const data = await getDiplomaCanditatePrisma();
  return NextResponse.json(data);
}
