import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getSelectedDomain(domainId: number) {
  try {
 const data = await prisma.general_domain_has_structure_type.findMany({
    where: { general_domain_id: domainId },
    select: { structure_type_id: true },
    orderBy: { structure_type_id: "asc" },
  });

  return data.map((e) => String(e.structure_type_id));
  } catch (error) {
       logger.error('Erreur SELECT general_domain_has_structure_type', { table: 'general_domain_has_structure_type', error });
       throw error;
  }
 
}
