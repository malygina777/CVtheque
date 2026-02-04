
import { prisma } from "@/lib/prisma";

export async function generalDomainsPrisma() {
  const rows = await prisma.general_domain.findMany({
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });

  // UI-формат: { id, label }
  const data = rows.map((r) => ({
    id: String(r.id),
    label: r.fullname,
  }));

  return data;
}