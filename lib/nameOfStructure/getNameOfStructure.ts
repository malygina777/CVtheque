import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export type NameOfStructure = {
  id: number;
  fullname: string;
};

export async function getNameOfStructure(): Promise<NameOfStructure[]> {
  try {
   return prisma.structure.findMany({
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });
  } catch (error) {
    logger.error('Erreur SELECT structure', { table: 'structure', error });
           throw error;
  }
  
}
