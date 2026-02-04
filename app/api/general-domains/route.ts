import { NextResponse } from "next/server";
import { generalDomainsPrisma } from "@/lib/general-domains/general-domains";

export async function GET() {
  const data = await generalDomainsPrisma();

  return NextResponse.json(data);
}

