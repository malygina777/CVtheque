
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function generalDomainsPrisma() {
  try {
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
  } catch (error) {
    logger.error('Erreur SELECT general_domain', { table: 'general_domain', error });
       throw error;
  }
  
}