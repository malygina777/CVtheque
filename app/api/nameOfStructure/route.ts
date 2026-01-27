import { NextResponse } from "next/server";
import { getNameOfStructure } from "@/lib/nameOfStructure/getNameOfStructure";

export async function GET() {
  try {
    const nameOfStructure = await getNameOfStructure();
    return NextResponse.json(nameOfStructure);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Unable to load names of structure" },
      { status: 500 },
    );
  }
}
