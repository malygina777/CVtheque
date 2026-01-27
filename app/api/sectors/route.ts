import { NextResponse } from "next/server";
import { getSectors } from "@/lib/sectors/getSectors";

export async function GET() {
  const sectors = await getSectors();
  return NextResponse.json(sectors);
}
