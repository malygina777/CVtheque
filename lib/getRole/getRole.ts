import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getRole(userId: string) {
  try {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, name: true },
  });
  } catch (error) {
     logger.error('Erreur SELECT user', { table: 'user', error });
           throw error;
  }
  
}
