import { NextResponse } from "next/server";
import { getGeneralDomains } from "@/lib/generalDomains/getGeneralDomains";

export async function GET() {
  try {
    const domains = await getGeneralDomains();
    return NextResponse.json(domains);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Unable to load general domains" },
      { status: 500 },
    );
  }
}
