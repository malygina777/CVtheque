import { NextResponse } from "next/server";
import { getExpertise } from "@/lib/getExpertise/getExpertise";

export async function GET() {
  try {
    const data = await getExpertise();
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
  }
}
