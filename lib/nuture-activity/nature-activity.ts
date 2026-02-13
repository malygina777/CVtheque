import { prisma } from "@/lib/prisma";

export async function natureActivityPrisma() {
  const rows = await prisma.nature_of_activity.findMany({
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });

  const data = rows.map((r) => ({
    id: String(r.id),
    label: r.fullname,
  }));

  return data;
}
