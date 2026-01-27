import { NextResponse } from "next/server";
import { getStructureCandidatePrisma } from "@/lib/getStructureCandidate/getStructureCandidatePrisma";

export async function GET() {
  const res = await getStructureCandidatePrisma();
  return NextResponse.json(res);
}
