import { NextResponse } from "next/server";
import { getNameCandidatePrisma } from "@/lib/getNameCandidate/getNameCandidatePrisma";

export async function GET() {
  const res = await getNameCandidatePrisma();
  return NextResponse.json(res);
}
