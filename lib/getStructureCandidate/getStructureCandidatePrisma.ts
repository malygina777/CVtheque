import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getStructureCandidatePrisma() {
  try {
  return prisma.structure_type.findMany({
    where: {
      user_has_worked: {
        some: {},
      },
    },
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });
  } catch (error) {
   logger.error('Erreur SELECT structure_type', { table: 'structure_type', error });
          throw error;
  }
  
}
