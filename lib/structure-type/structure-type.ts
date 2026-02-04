import { prisma } from "@/lib/prisma";

export async function structureTypePrisma() {
  const rows = await prisma.structure_type.findMany({
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
