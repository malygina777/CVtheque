import { prisma } from "../prisma";
import { logger } from "@/lib/logger/logger";

export async function getSectors() {
  try {
   return await prisma.sectors.findMany({
    select: {
      id: true,
      fullname: true,
    },
    orderBy: {
      fullname: "asc",
    },
  });
  } catch (error) {
    logger.error('Erreur SELECT sectors', { table: 'sectors', error });
           throw error;
  }
  
}
