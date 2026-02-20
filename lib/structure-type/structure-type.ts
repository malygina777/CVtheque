import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function structureTypePrisma() {
  try {
    const rows = await prisma.structure_type.findMany({
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });

  const data = rows.map((r) => ({
    id: String(r.id),
    label: r.fullname,
  }));

  return data;
  } catch (error) {
    logger.error('Erreur SELECT structure_type', { table: 'structure_type', error });
           throw error;
  }
  
}
