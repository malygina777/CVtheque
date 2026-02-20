import { prisma } from "../prisma";
import { logger } from "@/lib/logger/logger";

export async function getDiplomas() {
  try {
 return prisma.rncp.findMany({
    select: {
      id: true,
      intitule: true,
    },
    orderBy: {
      intitule: "asc",
    },
  });
  } catch (error) {
   logger.error('Erreur SELECT rncp', { table: 'rncp', error });
       throw error;
  }
 
}
