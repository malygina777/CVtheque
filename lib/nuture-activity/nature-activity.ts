import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function natureActivityPrisma() {
  try {
    const rows = await prisma.nature_of_activity.findMany({
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });

  const data = rows.map((r) => ({
    id: String(r.id),
    label: r.fullname,
  }));

  return data;
  } catch (error) {
    logger.error('Erreur SELECT nature_of_activity', { table: 'nature_of_activity', error });
           throw error;
  }
  
}
