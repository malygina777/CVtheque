import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

type UpdataRole = { id: number; role: "user" | "teacher" | "admin" };

export async function updateRolePrisma(data: UpdataRole) {
  try {
    const profile = await prisma.profile.findUnique({
    where: { id: data.id },
    select: { auth_user_id: true },
  });

  if (!profile?.auth_user_id) {
    throw new Error("No auth_user_id for this profile");
  } else {
    return await prisma.user.update({
      where: { id: profile?.auth_user_id },
      data: { role: data.role },
    });
  }
  } catch (error) {
    logger.error('Erreur UPDATE user', { table: 'user', error });
           throw error;
  }
  
}
