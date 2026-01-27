import { NextResponse } from "next/server";
import { getExpertiseCandidatePrisma } from "@/lib/getExpertiseCandidate/getExpertiseCandidatePrisma";

export async function GET() {
  const res = await getExpertiseCandidatePrisma();
  return NextResponse.json(res);
}
