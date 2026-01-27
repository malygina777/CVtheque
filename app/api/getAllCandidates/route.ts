import { NextResponse } from "next/server";
import { getAllCandidatesPrisma } from "@/lib/getAllCandidates/getAllCandidates";

export async function GET() {
  const data = await getAllCandidatesPrisma();
  return NextResponse.json(data);
}
