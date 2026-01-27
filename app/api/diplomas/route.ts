import { NextResponse } from "next/server";
import { getDiplomas } from "@/lib/diplomas/getDiplomas";

export async function GET() {
  const diplomas = await getDiplomas();
  return NextResponse.json(diplomas);
}
