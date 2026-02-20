import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getProfilePrisma(userId: string) {
  try {
   const profile = await prisma.profile.findUnique({
    where: { auth_user_id: userId },
    select: { id: true },
  });
  return profile?.id ?? null;
  } catch (error) {
     logger.error('Erreur SELECT profile', { table: 'profile', error });
                throw error;
  }
 
}
