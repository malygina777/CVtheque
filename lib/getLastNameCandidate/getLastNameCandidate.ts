import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getLastNameCandidatePrisma() {
  try {
     return prisma.profile.findMany({
    distinct: ["lastname"],
    select: { id: true, lastname: true },
    orderBy: { lastname: "asc" },
  });
  } catch (error) {
     logger.error('Erreur SELECT profile', { table: 'profile', error });
            throw error;
  }
  
}
