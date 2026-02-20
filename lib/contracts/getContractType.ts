import { prisma } from "../prisma";
import { logger } from "@/lib/logger/logger";

export async function getContractType() {
  try {
    return prisma.contract_type.findMany({
    select: {
      id: true,
      fullname: true,
    },
    orderBy: {
      fullname: "asc",
    },
  });
  } catch (error) {
    logger.error('Erreur SELECT contract_type', { table: 'contract_type', error });
    throw error;
  }
 
}
