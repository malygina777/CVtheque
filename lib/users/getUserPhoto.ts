import prisma from "@/lib/prisma";
import { logger } from "better-auth";

export async function getUserPhotoName(userId: number) {
  try {
    const user = await prisma.profile.findUnique({
      where: { id: userId },
      select: { photo: true },
    });

    logger.debug(`Récupération du nom de la photo de l'utilisateur`, { table: 'profile', userId: userId })
    return user?.photo ?? null;
  }
  catch(error) {
    logger.error(`Récupération du nom de la photo de l'utilisateur`, { table: 'profile', userId: userId, error })
  }

}
