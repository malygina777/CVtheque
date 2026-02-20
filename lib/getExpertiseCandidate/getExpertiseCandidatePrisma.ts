import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getExpertiseCandidatePrisma() {
  try {
    return prisma.expertise.findMany({
    where: {
      user_has_expertise: {
        some: {},
      },
    },
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });
  } catch (error) {
      logger.error('Erreur SELECT expertise', { table: 'expertise', error });
             throw error;
  }
  
}
