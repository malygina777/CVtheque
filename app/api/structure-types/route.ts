import { NextResponse } from "next/server";
import { structureTypePrisma } from "../../../lib/structure-type/structure-type";

export async function GET() {
  const data = await structureTypePrisma();

  return NextResponse.json(data);
}
