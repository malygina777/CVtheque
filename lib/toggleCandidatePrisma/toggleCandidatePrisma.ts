import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function toggleCandidatePrisma(id: number) {
  try {
    const current = await prisma.profile.findUnique({
    where: { id: id },
    select: { enable: true },
  });

  if (!current) {
    return new Error("Profile not found");
  }

  return await prisma.profile.update({
    where: { id: id },
    data: { enable: !current.enable },
    select: { enable: true },
  });

  } catch (error) {
    logger.error('Erreur UPDATE profile', { table: 'profile', error });
           throw error;
  }
  
}
