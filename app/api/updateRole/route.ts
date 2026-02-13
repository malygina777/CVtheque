import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRole } from "@/lib/getRole/getRole";
import { updateRolePrisma } from "@/lib/updateRolePrisma/updateRolePrisma";

type UpdateRoleBody = {
  id: number;
  role: "user" | "teacher" | "admin";
};

export async function POST(req: Request) {
  const data: UpdateRoleBody = await req.json();
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getRole(String(session?.user.id));

  if (user?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const res = await updateRolePrisma({ id: data.id, role: data.role });

  return NextResponse.json(res);
}
