import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getDiplomaCanditatePrisma() {
  try {
    return prisma.rncp.findMany({
    where: {
      user_has_rncp: {
        some: {},
      },
    },
    select: { id: true, intitule: true },
    orderBy: { intitule: "asc" },
  });
  } catch (error) {
    logger.error('Erreur SELECT rncp', { table: 'rncp', error });
           throw error;
  }
  
}
