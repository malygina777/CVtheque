import { NextResponse } from "next/server";
import { getLastNameCandidatePrisma } from "@/lib/getLastNameCandidate/getLastNameCandidate";

export async function GET() {
  const res = await getLastNameCandidatePrisma();
  return NextResponse.json(res);
}
