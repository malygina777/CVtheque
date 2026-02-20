import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export type TypeOfStructure = {
  id: number;
  fullname: string;
  shortname: string | null;
};

export async function getTypeOfStructure(
  domainId: number,
): Promise<TypeOfStructure[]> {
  try {
     return prisma.structure_type.findMany({
    where: {
      general_domain_has_structure_type: {
        some: {
          general_domain_id: domainId,
        },
      },
    },
    select: { id: true, fullname: true, shortname: true },
    orderBy: { fullname: "asc" },
  });
  } catch (error) {
    logger.error('Erreur SELECT structure_type', { table: 'structure_type', error });
           throw error;
  }
 
}
