import { NextResponse } from "next/server";
import { getAllUsersWithRolePrisma } from "@/lib/getAllUsersWithRolePrisma/getAllUsersWithRolePrisma";

export async function GET() {
  try {
    const users = await getAllUsersWithRolePrisma();
    return NextResponse.json({ users });
  } catch (e) {
    NextResponse.json({ error: " Failed to fetch users" }, { status: 500 });
  }
}
