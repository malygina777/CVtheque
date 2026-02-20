import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function getAllUsersWithRolePrisma() {
  try {
    const users = await prisma.profile.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      user: {
        select: { role: true },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    firstname: u.firstname,
    lastname: u.lastname,
    role: u.user?.role,
  }));
  } catch (error) {
    logger.error('Erreur SELECT profile', { table: 'profile', error });
       throw error;
  }
 
}
