import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getNameCandidatePrisma() {
  try {
    return prisma.profile.findMany({
    distinct: ["firstname"],
    select: { id: true, firstname: true },
    orderBy: { firstname: "asc" },
  });
  } catch (error) {
     logger.error('Erreur SELECT profile', { table: 'profile', error });
            throw error;
  }
  
}
