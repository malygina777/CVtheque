import { NextResponse } from "next/server";
import { getContractType } from "@/lib/contracts/getContractType";

export async function GET() {
  const contracts = await getContractType();
  return NextResponse.json(contracts);
}
